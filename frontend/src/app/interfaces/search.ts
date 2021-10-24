import { Game } from "./game";

export interface Search {
    games: Game[];
    name: string;
    genres: string[];
    platform: string[];
    publisher: string;
    developer: string;
    categories: string[];
    totalHits: number;
    lastFrom: number;
    minPrice: number;
    maxPrice: number;
}
