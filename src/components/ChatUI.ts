// ChatUI.ts
// Enkel chat UI-komponent

export class ChatUI {
    private container: HTMLElement;
    private messages: HTMLElement;
    private input: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private userHistory: string[] = [];
    private historyIndex: number = -1;

    constructor(
        containerId: string,
        onSend: (message: string) => void,
        settings?: { persona: string; temperature: number; top_p: number; max_tokens: number; presence_penalty: number; frequency_penalty: number; top_k: number }
    ) {
        this.container = document.getElementById(containerId)!;
        this.container.innerHTML = '';

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

        // Ladda historik från cookie
        const historyCookie = getCookie('chat_history');
        if (historyCookie) {
            try {
                this.userHistory = JSON.parse(historyCookie);
            } catch {}
        }


        // Inställningslänk med ikon och nuvarande värden
        const settingsBar = document.createElement('div');
        settingsBar.className = 'chat-settings-bar settings-bar-main'; // Removed inline styles

        const valuesDiv = document.createElement('div');
        valuesDiv.className = 'settings-bar-values'; // Removed inline styles
        if (settings) {
            valuesDiv.textContent = `Temp: ${settings.temperature} | Top_p: ${settings.top_p} | Max_tokens: ${settings.max_tokens} | Pres_pen: ${settings.presence_penalty} | Freq_pen: ${settings.frequency_penalty} | Top_k: ${settings.top_k}`;
        }
        settingsBar.appendChild(valuesDiv);

        const settingsLink = document.createElement('a');
        settingsLink.href = '#settings';
        settingsLink.title = 'Inställningar';
        settingsLink.innerHTML = `<span class="material-symbols-outlined" style="font-size: 24px; color: #90caf9; vertical-align: middle;">build</span>`;
        settingsLink.className = 'settings-bar-link'; // Removed inline styles
        settingsBar.appendChild(settingsLink);
        this.container.appendChild(settingsBar);

        this.messages = document.createElement('div');
        this.messages.className = 'chat-messages';
        this.container.appendChild(this.messages);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'chat-input-container';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Skriv ett meddelande...';
        inputContainer.appendChild(this.input);

        this.sendButton = document.createElement('button');
        this.sendButton.textContent = 'Skicka';
        inputContainer.appendChild(this.sendButton);

        this.container.appendChild(inputContainer);

        // Fokusera input automatiskt när ChatUI skapas
        setTimeout(() => {
            this.input.focus();
        }, 0);

        this.sendButton.onclick = () => {
            const msg = this.input.value.trim();
            if (msg) {
                onSend(msg);
                // Spara till historik
                if (!this.userHistory.length || this.userHistory[this.userHistory.length - 1] !== msg) {
                    this.userHistory.push(msg);
                    if (this.userHistory.length > 100) this.userHistory.shift();
                    setCookie('chat_history', JSON.stringify(this.userHistory), 365);
                }
                this.historyIndex = -1;
                this.input.value = '';
            }
        };
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendButton.click();
            } else if (e.key === 'ArrowUp') {
                if (this.userHistory.length) {
                    if (this.historyIndex === -1) {
                        this.historyIndex = this.userHistory.length - 1;
                    } else if (this.historyIndex > 0) {
                        this.historyIndex--;
                    }
                    this.input.value = this.userHistory[this.historyIndex];
                    setTimeout(() => {
                        this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
                    }, 0);
                }
            } else if (e.key === 'ArrowDown') {
                if (this.userHistory.length && this.historyIndex !== -1) {
                    if (this.historyIndex < this.userHistory.length - 1) {
                        this.historyIndex++;
                        this.input.value = this.userHistory[this.historyIndex];
                    } else {
                        this.historyIndex = -1;
                        this.input.value = '';
                    }
                    setTimeout(() => {
                        this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
                    }, 0);
                }
            }
        });
    }

    addMessage(text: string, fromUser: boolean = false) {
        const msgElem = document.createElement('div');
        msgElem.className = fromUser ? 'chat-message user' : 'chat-message server';
        if (fromUser) {
            msgElem.textContent = text;
        } else {
            msgElem.innerHTML = text;
        }
        this.messages.appendChild(msgElem);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    addStreamedMessage(fromUser: boolean = false): (token: string) => void {
        const msgElem = document.createElement('div');
        msgElem.className = fromUser ? 'chat-message user' : 'chat-message server';
        msgElem.innerHTML = '';
        this.messages.appendChild(msgElem);
        this.messages.scrollTop = this.messages.scrollHeight;
        return (token: string) => {
            if (fromUser) {
                msgElem.textContent += token;
            } else {
                msgElem.innerHTML += token;
            }
            this.messages.scrollTop = this.messages.scrollHeight;
        };
    }
}
