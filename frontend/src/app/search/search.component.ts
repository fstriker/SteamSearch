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

  priceLabel: string = "Price";
  positiveLabel: string = "Positive ratings";
  negativeLabel: string = "Negative ratings";
  averageLabel: string = "Average playtime";
  priceRequestName: string = "price";
  positiveRequestName: string = "positive_ratings";
  negativeRequestName: string = "negative_ratings";
  averageRequestName: string = "average_playtime";

  sortControl = new FormControl();
  sortList: string[] = [this.priceLabel, this.positiveLabel, this.negativeLabel, this.averageLabel];

  ascLabel: string = "Ascending";
  desLabel: string = "Descending";
  ascRequestName: string = "asc";
  desRequestName: string = "desc";

  modeControl = new FormControl();
  modeList: string[] = [this.ascLabel,this.desLabel];

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
    if (this.sortControl.value == this.priceLabel) {
      sort = this.priceRequestName;
    } else if (this.sortControl.value == this.positiveLabel) {
      sort = this.positiveRequestName;
    } else if (this.sortControl.value == this.negativeLabel) {
      sort = this.negativeRequestName
    } else if (this.sortControl.value == this.averageLabel) {
      sort = this.averageRequestName
    } else {
      sort = "";
    }
    if (this.modeControl.value == this.desLabel) {
      mode = this.desRequestName;
    } else if (this.modeControl.value == this.ascLabel) {
      mode = this.ascRequestName;
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
