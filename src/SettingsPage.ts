// SettingsPage.ts
// Enkel inställningssida för persona, temperature och top_p

export class SettingsPage {
    private container: HTMLElement;
    constructor(containerId: string, initial: { persona: string; temperature: number; top_p: number; max_tokens: number; presence_penalty: number; frequency_penalty: number; top_k: number }, onSave: (settings: { persona: string; temperature: number; top_p: number; max_tokens: number; presence_penalty: number; frequency_penalty: number; top_k: number }) => void) {
        this.container = document.getElementById(containerId)!;
        this.container.innerHTML = '';

        const form = document.createElement('form');
        form.className = 'settings-form-main';

        // Persona
        const personaLabel = document.createElement('label');
        personaLabel.textContent = 'Persona (system prompt):';
        personaLabel.className = 'settings-label';
        const personaInput = document.createElement('textarea');
        personaInput.value = initial.persona;
        personaInput.rows = 12;
        personaInput.className = 'settings-textarea';
        form.appendChild(personaLabel);
        form.appendChild(personaInput);

        // Temperature
        const tempLabel = document.createElement('label');
        tempLabel.textContent = 'Temperature:';
        tempLabel.className = 'settings-label settings-label-margin';
        const tempInput = document.createElement('input');
        tempInput.type = 'number';
        tempInput.step = '0.01';
        tempInput.min = '0';
        tempInput.max = '2';
        tempInput.value = initial.temperature.toString();
        tempInput.className = 'settings-input';
        form.appendChild(tempLabel);
        form.appendChild(tempInput);

        // Top_p
        const topPLabel = document.createElement('label');
        topPLabel.textContent = 'Top_p:';
        topPLabel.className = 'settings-label settings-label-margin';
        const topPInput = document.createElement('input');
        topPInput.type = 'number';
        topPInput.step = '0.01';
        topPInput.min = '0';
        topPInput.max = '1';
        topPInput.value = initial.top_p.toString();
        topPInput.className = 'settings-input settings-input-margin';
        form.appendChild(topPLabel);
        form.appendChild(topPInput);

        // max_tokens
        const maxTokensLabel = document.createElement('label');
        maxTokensLabel.textContent = 'Max tokens:';
        maxTokensLabel.className = 'settings-label settings-label-margin';
        const maxTokensInput = document.createElement('input');
        maxTokensInput.type = 'number';
        maxTokensInput.step = '1';
        maxTokensInput.min = '1';
        maxTokensInput.max = '8192';
        maxTokensInput.value = initial.max_tokens.toString();
        maxTokensInput.className = 'settings-input';
        form.appendChild(maxTokensLabel);
        form.appendChild(maxTokensInput);

        // presence_penalty
        const presencePenaltyLabel = document.createElement('label');
        presencePenaltyLabel.textContent = 'Presence penalty:';
        presencePenaltyLabel.className = 'settings-label settings-label-margin';
        const presencePenaltyInput = document.createElement('input');
        presencePenaltyInput.type = 'number';
        presencePenaltyInput.step = '0.01';
        presencePenaltyInput.min = '-2';
        presencePenaltyInput.max = '2';
        presencePenaltyInput.value = initial.presence_penalty.toString();
        presencePenaltyInput.className = 'settings-input';
        form.appendChild(presencePenaltyLabel);
        form.appendChild(presencePenaltyInput);

        // frequency_penalty
        const frequencyPenaltyLabel = document.createElement('label');
        frequencyPenaltyLabel.textContent = 'Frequency penalty:';
        frequencyPenaltyLabel.className = 'settings-label settings-label-margin';
        const frequencyPenaltyInput = document.createElement('input');
        frequencyPenaltyInput.type = 'number';
        frequencyPenaltyInput.step = '0.01';
        frequencyPenaltyInput.min = '-2';
        frequencyPenaltyInput.max = '2';
        frequencyPenaltyInput.value = initial.frequency_penalty.toString();
        frequencyPenaltyInput.className = 'settings-input';
        form.appendChild(frequencyPenaltyLabel);
        form.appendChild(frequencyPenaltyInput);

        // top_k
        const topKLabel = document.createElement('label');
        topKLabel.textContent = 'Top_k:';
        topKLabel.className = 'settings-label settings-label-margin';
        const topKInput = document.createElement('input');
        topKInput.type = 'number';
        topKInput.step = '1';
        topKInput.min = '1';
        topKInput.max = '100';
        topKInput.value = initial.top_k.toString();
        topKInput.className = 'settings-input settings-input-margin';
        form.appendChild(topKLabel);
        form.appendChild(topKInput);

        // Spara-knapp
        const saveBtn = document.createElement('button');
        saveBtn.type = 'submit';
        saveBtn.textContent = 'Spara inställningar';
        saveBtn.className = 'settings-save-btn';
        form.appendChild(saveBtn);

        form.onsubmit = (e) => {
            e.preventDefault();
            onSave({
                persona: personaInput.value,
                temperature: parseFloat(tempInput.value),
                top_p: parseFloat(topPInput.value),
                max_tokens: parseInt(maxTokensInput.value),
                presence_penalty: parseFloat(presencePenaltyInput.value),
                frequency_penalty: parseFloat(frequencyPenaltyInput.value),
                top_k: parseInt(topKInput.value)
            });
        };

        // settings-form-main används redan
        this.container.appendChild(form);
    }
}
