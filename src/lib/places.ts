export const popularDestinations = [
    // Principais Distritos e Cidades de Portugal
    "Lisboa, Portugal",
    "Porto, Portugal",
    "Braga, Portugal",
    "Coimbra, Portugal",
    "Faro, Portugal (Algarve)",
    "Aveiro, Portugal",
    "Setúbal, Portugal",
    "Leiria, Portugal",
    "Viseu, Portugal",
    "Funchal, Madeira",
    "Ponta Delgada, Açores",
    "Évora, Portugal",
    "Viana do Castelo, Portugal",
    "Guimarães, Portugal",
    "Sintra, Portugal",
    "Cascais, Portugal",

    // Outros Países Comuns
    "Espanha",
    "França",
    "Itália",
    "Reino Unido",
    "Alemanha",
    "Irlanda",
    "Suíça"
];

export function searchPlaces(query: string): string[] {
    const q = query.toLowerCase();
    return popularDestinations.filter(place => place.toLowerCase().includes(q));
}
