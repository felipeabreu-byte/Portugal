import { ChecklistItem } from "@prisma/client";

export interface Suggestion {
    id: string;
    title: string;
    description: string;
    type: 'WARNING' | 'INFO' | 'ACTION';
    actionLabel?: string;
    actionLink?: string; // Could be a link or an identifier for a modal
}

// Mock context for now. In a real app, this would come from User profile or Trip settings.
const MOCK_CONTEXT = {
    destination: 'Portugal',
    travelDate: new Date('2026-06-15'), // Future date
    climate: 'cold', // derived from date/destination
};

export function generateSuggestions(items: ChecklistItem[], progress: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const today = new Date();

    // Rule 1: Passport/Documents
    // Find "Documentos" category items if possible, or just search by string content which is fragile but works for simple MVPs.
    // Better: We look for specific keywords in pending items.
    const pendingItems = items.filter(i => i.status !== 'COMPLETED' && i.status !== 'NOT_APPLICABLE');

    const hasPassportCheck = items.some(i => i.title.toLowerCase().includes('passaporte'));
    if (!hasPassportCheck) {
        suggestions.push({
            id: 'add-passport',
            title: 'Documentação Essencial',
            description: 'Não esqueça de verificar a validade do seu passaporte. Adicione à lista de documentos.',
            type: 'ACTION'
        });
    }

    // Rule 2: Progress
    if (progress < 30 && progress > 0) {
        suggestions.push({
            id: 'boost-progress',
            title: 'Acelere o planejamento',
            description: 'Você está apenas no começo. Que tal definir sua hospedagem esta semana?',
            type: 'INFO'
        });
    }

    // Rule 3: Climate (Mock)
    if (MOCK_CONTEXT.climate === 'cold') {
        const hasCoat = items.some(i => i.title.toLowerCase().includes('casaco') || i.title.toLowerCase().includes('frio'));
        if (!hasCoat) {
            suggestions.push({
                id: 'weather-cold',
                title: 'Prepare-se para o Frio',
                description: 'A previsão indica temperaturas baixas. Lembre-se de levar casacos pesados.',
                type: 'WARNING'
            });
        }
    }

    // Rule 4: Critical Items
    const criticalPending = pendingItems.filter(i => i.priority === 'CRITICAL');
    if (criticalPending.length > 0) {
        suggestions.push({
            id: 'critical-items',
            title: 'Itens Críticos Pendentes',
            description: `Você tem ${criticalPending.length} itens críticos não resolvidos. Dê prioridade a eles!`,
            type: 'WARNING'
        });
    }

    // Fallback / Generic
    if (suggestions.length === 0 && progress < 100) {
        suggestions.push({
            id: 'generic-review',
            title: 'Revisão Semanal',
            description: 'Tire um momento para revisar seus gastos e documentos.',
            type: 'INFO'
        });
    }

    return suggestions;
}
