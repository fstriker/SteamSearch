export interface Game {
    name: string;
    date: string;
    publisher: string;
    developer: string;
    platform: string;
    genre: string;
    categories: string;
    header_img: string;
    achievements: number;
    average_playtime: number;
    median_playtime: number;
    negative_ratings: number;
    owners: string;
    positive_ratings: number;
    required_age: number;
    screenshots: string[];
    movies: string[];
}
