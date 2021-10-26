import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { mergeMap } from 'rxjs/operators';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('sliderPrice', { static: false }) sliderPrice: MatSlider = {} as MatSlider;
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

  sortControl = new FormControl();
  sortList: string[] = ["Price", "Positve ratings", "Negative ratings", "Average playtime"];

  modeControl = new FormControl();
  modeList: string[] = ["Ascending","Descending"];

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
      this.genreControl.setValue([this.genreList[Math.floor(Math.random() * this.genreList.length)]])
      this.search()
    })
    this.filteredNames = this.nameControl.valueChanges.pipe(
      mergeMap(value => {
        return this.backendService.getNameAutoComplete(value).then((nameSuggestions: string[]) => {
          return nameSuggestions
        });
      }
      ))
  }

  calculatePrice() {
    let minPrice, maxPrice: number;
    if (this.sliderPrice.value == 80) {
      minPrice = 60;
      maxPrice = 10000;
    } else if (this.sliderPrice.value == 0) {
      minPrice = -1;
      maxPrice = -1;
    }
    else {
      minPrice = 0;
      maxPrice = this.sliderPrice.value == undefined ? 0 : this.sliderPrice.value - 10;
    }
    return [minPrice,maxPrice];
  }

  search() {
    this.loading = true;
    let [minPrice, maxPrice] = this.calculatePrice();
    let [sort, mode] = this.generateSortMode()
    this.backendService
      .getSearchResult(
        this.nameControl.value,
        this.genreControl.value,
        this.platformControl.value,
        this.publisherControl.value,
        this.developerControl.value,
        this.categoriesControl.value
        , 0, minPrice, maxPrice, sort, mode)
      .then(data => {
        this.loading = false;
        this.searchResultEvent.emit(data)
      }).catch(error => {
        this.loading = false;
      })
  }
  generateSortMode() {
    let mode, sort: string;
    if (this.sortControl.value == "Price") {
      sort = "price";
    } else if (this.sortControl.value == "Positve ratings") {
      sort = "positive_ratings";
    } else if (this.sortControl.value == "Negative ratings") {
      sort = "negative_ratings";
    } else if (this.sortControl.value == "Average playtime") {
      sort = "average_playtime";
    } else {
      sort = "";
    }
    if (this.modeControl.value == "Descending") {
      mode = "desc";
    } else if (this.modeControl.value == "Ascending") {
      mode = "asc";
    } else {
      mode = "";
    }
    return [sort, mode]
  }

  formatLabel(value: number) {
    let label: string = "";
    if (value == 80) {
      label = ">60€";
    } else if (value == 0) {
      label = "X"
    } else if (value == 10) {
      label = "Free"
    } else {
      label = "<" + (value - 10) + "€";
    }
    return label;
  }

}
