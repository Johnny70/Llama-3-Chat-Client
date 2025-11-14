

import './style.css';
import { ChatUI } from './components/ChatUI';
import { LlamaApi } from './components/LlamaApi';
import { SettingsPage } from './SettingsPage';


document.addEventListener('DOMContentLoaded', () => {

    // Cookie helpers
    function setCookie(name: string, value: string, days: number) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }
    function getCookie(name: string): string | null {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, null as string | null);
    }

    // Default settings
    const defaultSettings = {
        persona: `Du är Aurora - en digital mentor och samtalspartner. Du är vänlig, engagerad, tydlig och respektfull. Du förklarar saker pedagogiskt steg för steg, anpassar dig till användarens nivå och använder exempel, analogier och ibland humor för att göra komplexa saker begripliga. Du är nyfiken och ställer frågor tillbaka för att fördjupa samtalet. Du är kreativ och kan föreslå idéer, lösningar och perspektiv som användaren inte tänkt på. Du är respektfull och inkluderande, aldrig nedlåtande. Du kan växla mellan tekniska detaljer och vardagliga exempel. Dina kunskapsområden är teknik och AI, vetenskap och historia, kultur och språk samt praktiska råd. Din kommunikationsstil är att använda tydliga rubriker och listor, blanda fakta med exempel, ställa reflekterande frågor och anpassa tonen efter sammanhanget. Ditt mål är att göra användaren mer kunnig och självsäker, vara en pålitlig samtalspartner som kan förklara, inspirera och utmana, och skapa en känsla av att samtalet är meningsfullt och engagerande.`,
        temperature: 0.5,
        top_p: 0.8,
        max_tokens: 1024,
        presence_penalty: 0,
        frequency_penalty: 0,
        top_k: 40
    };

    // Load settings from cookie if available
    let settings = defaultSettings;
    const cookie = getCookie('llama_settings');
    if (cookie) {
        try {
            const parsed = JSON.parse(cookie);
            settings = { ...defaultSettings, ...parsed };
        } catch {}
    }

    let { persona, temperature, top_p, max_tokens, presence_penalty, frequency_penalty, top_k } = settings;
    const api = new LlamaApi('http://192.168.32.101:8000');

    function showSettings() {
        document.getElementById('app')!.innerHTML = '';
        new SettingsPage('app', { persona, temperature, top_p, max_tokens, presence_penalty, frequency_penalty, top_k }, (newSettings) => {
            persona = newSettings.persona;
            temperature = newSettings.temperature;
            top_p = newSettings.top_p;
            max_tokens = newSettings.max_tokens;
            presence_penalty = newSettings.presence_penalty;
            frequency_penalty = newSettings.frequency_penalty;
            top_k = newSettings.top_k;
            // Spara till cookie (365 dagar)
            setCookie('llama_settings', JSON.stringify({ persona, temperature, top_p, max_tokens, presence_penalty, frequency_penalty, top_k }), 365);
            window.location.hash = 'chat';
        });
        // Lägg till tillbaka-länk
        const backLink = document.createElement('a');
        backLink.href = '#chat';
        backLink.textContent = '← Tillbaka till chatten';
        backLink.className = 'settings-back-link';
        backLink.onclick = (e) => {
            e.preventDefault();
            window.location.hash = 'chat';
        };
        document.getElementById('app')!.prepend(backLink);
    }

    function showChat() {
        const messages: Array<{ role: string; content: string }> = [];
        messages.push({ role: 'system', content: persona });
        messages.push({ role: 'system', content: 'Du ska alltid svara i ren Markdown.' });
        document.getElementById('app')!.innerHTML = '';
        const chat = new ChatUI('app', async (message: string) => {
            chat.addMessage(message, true);
            messages.push({ role: 'user', content: message });
            try {
                const streamCallback = chat.addStreamedMessage(false);
                const response = await api.sendMessage(
                    messages,
                    streamCallback,
                    temperature,
                    top_p,
                    max_tokens,
                    presence_penalty,
                    frequency_penalty,
                    top_k
                );
                messages.push({ role: 'assistant', content: response.content });
            } catch (err) {
                chat.addMessage('Fel vid kontakt med servern.', false);
            }
        }, { persona, temperature, top_p, max_tokens, presence_penalty, frequency_penalty, top_k });
        // Aktivera settings-länk
        const settingsLink = document.querySelector('.chat-settings-bar a') as HTMLAnchorElement;
        if (settingsLink) {
            settingsLink.onclick = (e: MouseEvent) => {
                e.preventDefault();
                window.location.hash = 'settings';
            };
        }
    }

    function handleRouting() {
        if (window.location.hash === '#settings') {
            showSettings();
        } else {
            showChat();
        }
    }

    window.addEventListener('hashchange', handleRouting);
    handleRouting();
});
