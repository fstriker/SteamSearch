import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game';
import { Search } from '../interfaces/search';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  backendUrl: string = "http://127.0.0.1:5000";

  constructor(private http: HttpClient) { }

  getTags() {
    return this.http.get(this.backendUrl + "/api/getTags").toPromise().then((data: any) => {
      let categorieTags = Object.keys(data.aggregations.unique_categories.buckets).map(key => data.aggregations.unique_categories.buckets[key].key)
      let developerTags = Object.keys(data.aggregations.unique_developers.buckets).map(key => data.aggregations.unique_developers.buckets[key].key)
      let genreTags = Object.keys(data.aggregations.unique_genres.buckets).map(key => data.aggregations.unique_genres.buckets[key].key)
      let platformTags = Object.keys(data.aggregations.unique_platforms.buckets).map(key => data.aggregations.unique_platforms.buckets[key].key)
      let publisherTags = Object.keys(data.aggregations.unique_publisher.buckets).map(key => data.aggregations.unique_publisher.buckets[key].key)
      return [categorieTags, developerTags, genreTags, platformTags, publisherTags]
    })
  }

  buildSearchParams(name: string, genreTags: string[], platformTags: string[], publisher: string, developer: string, categorieTags: string[], from: number) {
    let dictParams: any = {};
    if (name != null && name != "") dictParams["name"] = name;
    if (genreTags != undefined && genreTags.length > 0) dictParams["genreTags"] = genreTags.toString();
    if (platformTags != null && platformTags.length > 0) dictParams["platformTags"] = platformTags.toString();
    if (publisher != null && publisher != "") dictParams["publisherTags"] = publisher;
    if (developer != null && developer != "") dictParams["developerTags"] = developer;
    if (categorieTags != null && categorieTags.length > 0) dictParams["categorieTags"] = categorieTags.toString();
    dictParams["from"] = from;
    return dictParams;
  }

  buildGameList(gameDataArray: any) {
    const gameList: Game[] = [];
    for (let index in gameDataArray) {
      let gameData = gameDataArray[index];
      let allMovieList = Object.keys(gameData.movies).map(key => gameData.movies[key].webm)
      let movies: string[] = [];
      for (let index in allMovieList) {
        movies.push(allMovieList[index]["480"])
      }
      let game: Game = {
        achievements: gameData.achievements,
        average_playtime: gameData.average_playtime,
        categories: gameData.categories,
        date: gameData.release_date,
        developer: gameData.developer,
        genre: gameData.genres,
        header_img: gameData.header_image,
        median_playtime: gameData.median_playtime,
        name: gameData.name,
        negative_ratings: gameData.negative_ratings,
        owners: gameData.owners,
        platform: gameData.platforms,
        positive_ratings: gameData.positive_ratings,
        publisher: gameData.publisher,
        required_age: gameData.required_age,
        screenshots: gameData.screenshots,
        movies: movies
      }
      gameList.push(game);
    }
    return gameList;
  }

  getSearchResult(name: string, genreTags: string[], platformTags: string[], publisher: string, developer: string, categorieTags: string[], from: number) {
    let dictParams: any = this.buildSearchParams(name, genreTags, platformTags, publisher, developer, categorieTags, from);
    return this.http
      .get(this.backendUrl + "/api/search",
        {
          params: dictParams
        }).toPromise().then((data: any) => {
          const gameDataArray = Object.keys(data.hits.hits).map(key => data.hits.hits[key]._source);
          const gameList: Game[] = this.buildGameList(gameDataArray);
          const search: Search = {
            games: gameList,
            categories: categorieTags,
            developer: developer,
            genres: genreTags,
            name: name,
            platform: platformTags,
            publisher: publisher,
            totalHits: data.hits.total.value,
            lastFrom: from
          }
          return search
        })
  }

  getNameAutoComplete(name: string) {
    let dictParams: any = {};
    dictParams["name"] = name;
    return this.http.get(this.backendUrl + "/api/suggestor", {
      params: dictParams
    }).toPromise().then((data: any) => {
      return Object.keys(data.suggest.Autocomplete[0].options).map(key => data.suggest.Autocomplete[0].options[key]._source.name);
    })
  }
}



