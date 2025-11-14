// simpleFormat.ts
// Enkel parser för att konvertera text med 'Rubrik:', 'Steg X:', '1. ', '- ' till HTML

export function simpleFormat(text: string): string {
    // Rubrik
    text = text.replace(/^Rubrik:\s*(.+)$/gm, '<h3>$1</h3>');
    // Steg-lista
    text = text.replace(/Steg\s\d+:\s*([^\n]+)/g, '<li>$1</li>');
    // Numrerad lista
    text = text.replace(/\n?\d+\.\s*([^\n]+)/g, '<li>$1</li>');
    // Punktlista
    text = text.replace(/\n?-\s*([^\n]+)/g, '<li>$1</li>');
    // Om det finns <li>, wrappa i <ol> eller <ul>
    if (text.includes('<li>')) {
        // Om det är steg eller numrerad lista, använd <ol>
        if (/Steg\s\d+:|\d+\./.test(text)) {
            text = text.replace(/(<li>.*?<\/li>)+/gs, m => `<ol>${m}</ol>`);
        } else {
            text = text.replace(/(<li>.*?<\/li>)+/gs, m => `<ul>${m}</ul>`);
        }
    }
    // Radbrytningar till stycken
    text = text.replace(/\n{2,}/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    // Wrappa allt i <p> om ingen rubrik eller lista
    if (!/^<h3>|<ol>|<ul>/.test(text)) {
        text = `<p>${text}</p>`;
    }
    return text;
}
