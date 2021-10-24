import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BackendService } from '../services/backend.service';

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

  developerControl = new FormControl();

  nameControl = new FormControl();

  loading: boolean = false;

  constructor(public backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.getTags().then((data:any) => {
      this.categorieList = data[0];
      this.genreList = data[2];
      this.platformList = data[3];
    })
  }

  search() {
    this.loading = true;
    this.backendService
      .getSearchResult(
        this.nameControl.value,
        this.genreControl.value,
        this.platformControl.value,
        this.publisherControl.value,
        this.categoriesControl.value,
        this.developerControl.value,0)
      .then(data => {
        this.loading = false;
        this.searchResultEvent.emit(data)
      }).catch(error => {
        this.loading = false;
      })
  }

}
