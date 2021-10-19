import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  backendUrl: string = "http://127.0.0.1:5000";

  constructor(private http: HttpClient) { }

  getGenreTags() {
    return this.http.get(this.backendUrl + "/api/getGenreTags").toPromise().then((data: any) => {
      return Object.keys(data.aggregations.unique_field.buckets).map(key => data.aggregations.unique_field.buckets[key].key)
    })
  }

  getPublisherTags() {
    return this.http.get(this.backendUrl + "/api/getPublisherTags").toPromise().then((data: any) => {
      return Object.keys(data.aggregations.unique_field.buckets).map(key => data.aggregations.unique_field.buckets[key].key)
    })
  }

  getPlatformTags() {
    return this.http.get(this.backendUrl + "/api/getPlatformTags").toPromise().then((data: any) => {
      return Object.keys(data.aggregations.unique_field.buckets).map(key => data.aggregations.unique_field.buckets[key].key)
    })
  }

  getYearTags() {
    return this.http.get(this.backendUrl + "/api/getYearTags").toPromise().then((data: any) => {
      return Object.keys(data.aggregations.unique_field.buckets).map(key => data.aggregations.unique_field.buckets[key].key)
    })
  }

  getSearchResult(name: string, genreTags: String[], platformTags: String[], publisherTags: String[], yearTags: String[]) {
    let dictParams:any = {};
    if (name != null) dictParams["name"] = name;
    if (genreTags != undefined) dictParams["genreTags"] = genreTags.toString();
    if (platformTags != null) dictParams["platformTags"] = platformTags.toString();
    if (publisherTags != null) dictParams["publisherTags"] = publisherTags.toString();
    if (yearTags != null) dictParams["yearTags"] = yearTags.toString();
    return this.http
      .get(this.backendUrl + "/api/search",
        {
          params : dictParams
        }).toPromise().then((data: any) => {
          const gameDataArray = Object.keys(data.hits.hits).map(key => data.hits.hits[key]._source);
          const gameList: Game[] = [];
          for (let index in gameDataArray) {
            let game: Game = {
              genre: gameDataArray[index].Genre,
              name: gameDataArray[index].Name,
              publisher: gameDataArray[index].Publisher,
              rank: gameDataArray[index].Rank,
              year: gameDataArray[index].Year,
              platform: gameDataArray[index].Platform,
            }
            gameList.push(game);
          }
          return gameList
        })
  }
}


