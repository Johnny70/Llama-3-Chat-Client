// LlamaApi.ts

// Hanterar kommunikation med Llama-servern

import { markdownFormat } from '../utils/markdownFormat';


export interface LlamaRequest {
    messages: Array<{ role: string; content: string }>;
}


export interface LlamaResponse {
    content: string;
}

export type StreamCallback = (token: string) => void;

export class LlamaApi {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async sendMessage(
        messages: Array<{ role: string; content: string }>,
        onStream?: StreamCallback,
        temperature: number = 0.5,
        top_p: number = 0.8,
        max_tokens: number = 1024,
        presence_penalty: number = 0,
        frequency_penalty: number = 0,
        top_k: number = 40
    ): Promise<LlamaResponse> {

        const body: LlamaRequest = { messages };
        const response = await fetch(this.endpoint + '/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...body,
                stream: true,
                temperature,
                top_p,
                max_tokens,
                presence_penalty,
                frequency_penalty,
                top_k
            }),
        });
        if (!response.ok) throw new Error('Serverfel: ' + response.status);
        if (onStream && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let content = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                // Llama API streamar ofta med "data: ..." per rad
                chunk.split('\n').forEach(line => {
                    if (line.startsWith('data:')) {
                        try {
                            const json = JSON.parse(line.slice(5));
                            const token = json.choices?.[0]?.delta?.content || '';
                            if (token) {
                                content += token;
                                onStream(token);
                            }
                        } catch {}
                    }
                });
            }
            return { content: markdownFormat(content) };
        } else {
            const data = await response.json();
            const rawContent = data.choices?.[0]?.message?.content || '';
            return { content: markdownFormat(rawContent) };
        }
    }
}
