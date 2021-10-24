import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { map, mergeMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() searchResultEvent = new EventEmitter<any>();

  genreControl = new FormControl();
  genreList: string[] = [];

  platformControl = new FormControl();
  platformList: string[] = [];

  categoriesControl = new FormControl();
  categorieList: string[] = [];

  publisherControl = new FormControl();
  publisherList: string[] = [];

  developerControl = new FormControl();
  developerList: string[] = [];

  nameControl = new FormControl();
  names: string[] = [];
  filteredNames: Observable<string[]> = of([]);

  loading: boolean = false;

  constructor(public backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.getTags().then((data: any) => {
      this.categorieList = data[0];
      this.developerList = data[1];
      this.genreList = data[2];
      this.platformList = data[3];
      this.publisherList = data[4];
    })
    this.filteredNames = this.nameControl.valueChanges.pipe(
      mergeMap(value => {
        return this.backendService.getNameAutoComplete(value).then((nameSuggestions: string[]) => {
          return nameSuggestions
        });
      }
      ))
  }

  search() {
    this.loading = true;
    this.backendService
      .getSearchResult(
        this.nameControl.value,
        this.genreControl.value,
        this.platformControl.value,
        this.publisherControl.value,
        this.developerControl.value,
        this.categoriesControl.value
        , 0)
      .then(data => {
        this.loading = false;
        this.searchResultEvent.emit(data)
      }).catch(error => {
        this.loading = false;
      })
  }

}
