// markdownFormat.ts
// Formatterar markdown till HTML med marked

import { marked } from 'marked';

// Tar bort HTML-taggar ur texten
function stripHtmlTags(input: string): string {
    return input.replace(/<[^>]+>/g, '');
}

export function markdownFormat(text: string): string {
    const cleanText = stripHtmlTags(text);
    // marked.parse returnerar en sträng i browser-miljö
    return marked.parse(cleanText) as string;
}
