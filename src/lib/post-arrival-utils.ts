// Stabilization and achievement utilities — NOT a server action file
// These are pure functions moved out of 'use server' context

export function calculateStabilisation(docs: any[], housingStatus: string, autonomyMonths: number, hasEmployment: boolean) {
    const docScoreRaw = docs.reduce((acc: number, doc: any) => {
        if (doc.status === 'COMPLETED') return acc + 10;
        if (doc.status === 'IN_PROGRESS') return acc + 5;
        return acc;
    }, 0);
    const docScore = (docScoreRaw / 60) * 100;

    let housingScore = 0;
    if (housingStatus === 'DEFINITIVE') housingScore = 100;
    else if (housingStatus === 'TEMPORARY') housingScore = 50;
    else if (housingStatus === 'SEARCHING') housingScore = 30;

    let financeScore = 20;
    if (autonomyMonths === Infinity || autonomyMonths >= 6) financeScore = 100;
    else if (autonomyMonths >= 3) financeScore = 75;
    else if (autonomyMonths >= 1) financeScore = 50;

    const employmentScore = hasEmployment ? 100 : 0;

    const totalScore = Math.round(
        (docScore * 0.30) +
        (housingScore * 0.25) +
        (financeScore * 0.25) +
        (employmentScore * 0.20)
    );

    let classification = "Recém-chegado";
    if (totalScore > 85) classification = "Integrado";
    else if (totalScore > 60) classification = "Estabelecido";
    else if (totalScore > 30) classification = "Em adaptação";

    return { score: totalScore, classification };
}

export function calculateAchievements(docs: any[], housingStatus: string, financeItems: any[], daysInPortugal: number) {
    return [
        {
            id: 'cheguei',
            title: 'Cheguei em Portugal',
            description: 'Deu o primeiro passo na sua nova jornada física.',
            icon: '🇵🇹',
            completed: true
        },
        {
            id: 'conta_bancaria',
            title: 'Conta bancária aberta',
            description: 'Abriu sua conta em um banco português ou europeu.',
            icon: '🏦',
            completed: docs.some((d: any) => d.type === 'CONTA_BANCARIA' && d.status === 'COMPLETED')
        },
        {
            id: 'nif',
            title: 'NIF concluído',
            description: 'Obteve seu Número de Identificação Fiscal.',
            icon: '📄',
            completed: docs.some((d: any) => d.type === 'NIF' && d.status === 'COMPLETED')
        },
        {
            id: 'emprego',
            title: 'Primeiro emprego',
            description: 'Conseguiu um emprego ou iniciou atividade freelancer.',
            icon: '💼',
            completed: financeItems.some((f: any) => f.type === 'INCOME' && (f.category === 'Salário' || f.category === 'Freelance'))
        },
        {
            id: 'moradia',
            title: 'Moradia definitiva',
            description: 'Encontrou o seu lar definitivo em Portugal.',
            icon: '🏠',
            completed: housingStatus === 'DEFINITIVE'
        },
        {
            id: 'salario',
            title: 'Primeiro salário recebido',
            description: 'Registrou sua primeira receita em terras lusas.',
            icon: '💰',
            completed: financeItems.some((f: any) => f.type === 'INCOME')
        },
        {
            id: '90_dias',
            title: '90 dias em Portugal',
            description: 'Completou 3 meses de adaptação no país.',
            icon: '🗓️',
            completed: daysInPortugal >= 90
        },
        {
            id: '180_dias',
            title: '180 dias em Portugal',
            description: 'Completou 6 meses de moradia em Portugal.',
            icon: '🏆',
            completed: daysInPortugal >= 180
        }
    ];
}
