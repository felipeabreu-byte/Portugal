import { ChecklistItem, UserProfile } from "@prisma/client";

export interface Suggestion {
    id: string;
    title: string;
    description: string;
    type: 'WARNING' | 'INFO' | 'ACTION';
    actionLabel?: string;
    actionLink?: string;
}

export interface UserContext {
    travelDate: Date | null;
    city: string | null;
    profile: UserProfile | null;
}

export function generateSuggestions(items: ChecklistItem[], progress: number, context?: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const today = new Date();

    // --- Dynamic Contextual Notification (Priority 1) ---
    // Rules:
    // 1. days <= 7
    // 2. days <= 30
    // 3. Season = Winter
    // 4. Profile = Resident
    // 5. Fallback

    if (context?.travelDate) {
        const diffTime = context.travelDate.getTime() - today.getTime();
        const daysToTravel = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const travelMonth = context.travelDate.getMonth(); // 0-11 for Date objects

        // Season Logic for Portugal (Northern Hemisphere)
        // Dec(11), Jan(0), Feb(1) -> Winter
        // Mar(2), Apr(3), May(4) -> Spring
        // Jun(5), Jul(6), Aug(7) -> Summer
        // Sep(8), Oct(9), Nov(10) -> Autumn
        let isWinter = false;
        if (travelMonth === 11 || travelMonth === 0 || travelMonth === 1) isWinter = true;

        if (daysToTravel <= 7 && daysToTravel >= -1) { // -1 to handle "today/yesterday" slightly gracefully
            suggestions.push({
                id: 'ctx-week',
                title: 'Sua viagem é nesta semana!',
                description: 'Revise documentos, bagagem e transporte.',
                type: 'WARNING',
                actionLabel: 'Ver Checklist'
            });
        } else if (daysToTravel <= 30 && daysToTravel > 7) {
            suggestions.push({
                id: 'ctx-month',
                title: 'Sua viagem está próxima',
                description: 'Verifique hospedagem e últimos detalhes.',
                type: 'ACTION'
            });
        } else if (isWinter) {
            suggestions.push({
                id: 'ctx-winter',
                title: 'Inverno em Portugal',
                description: 'O inverno em Portugal pode ser frio. Prepare roupas adequadas.',
                type: 'INFO'
            });
        } else if (context.profile === 'RESIDENT') {
            suggestions.push({
                id: 'ctx-resident',
                title: 'Documentação de Residência',
                description: 'Organize documentos importantes para residência em Portugal.',
                type: 'ACTION'
            });
        } else {
            suggestions.push({
                id: 'ctx-fallback',
                title: 'Planejamento',
                description: 'Continue seu planejamento com calma.',
                type: 'INFO'
            });
        }
    } else {
        // No date set -> Prompt to set it
        suggestions.push({
            id: 'ctx-no-date',
            title: 'Defina sua Viagem',
            description: 'Cadastre a data da sua viagem para receber dicas personalizadas.',
            type: 'ACTION',
            actionLink: '/dashboard/trip',
            actionLabel: 'Começar'
        });
    }

    // --- Existing Specific Checks (Secondary) ---

    // Rule: Passport
    const hasPassportCheck = items.some(i => i.title.toLowerCase().includes('passaporte'));
    if (!hasPassportCheck) {
        suggestions.push({
            id: 'add-passport',
            title: 'Documentação Essencial',
            description: 'Não esqueça de verificar a validade do seu passaporte.',
            type: 'ACTION'
        });
    }

    // Rule: Progress
    if (progress < 30 && progress > 0) {
        suggestions.push({
            id: 'boost-progress',
            title: 'Acelere o planejamento',
            description: 'Você está apenas no começo. Que tal definir sua hospedagem esta semana?',
            type: 'INFO'
        });
    }

    // Rule: Critical Items
    const pendingItems = items.filter(i => i.status !== 'COMPLETED' && i.status !== 'NOT_APPLICABLE');
    const criticalPending = pendingItems.filter(i => i.priority === 'CRITICAL');
    if (criticalPending.length > 0) {
        suggestions.push({
            id: 'critical-items',
            title: 'Itens Críticos Pendentes',
            description: `Você tem ${criticalPending.length} itens críticos não resolvidos.`,
            type: 'WARNING'
        });
    }

    return suggestions;
}
