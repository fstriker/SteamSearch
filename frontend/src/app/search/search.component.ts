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

  publisherControl = new FormControl();
  publisherList: string[] = [];

  yearControl = new FormControl();
  yearList: string[] = [];

  nameControl = new FormControl();

  loading: boolean = false;

  constructor(public backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.getGenreTags().then(data => {
      this.genreList = data
    })
    this.backendService.getPlatformTags().then(data => {
      this.platformList = data
    })
    this.backendService.getPublisherTags().then(data => {
      this.publisherList = data
    })
    this.backendService.getYearTags().then(data => {
      this.yearList = data
    })
  }

  search() {
    this.loading = true;
    this.backendService.getSearchResult().then(data => {
      this.loading = false;
      this.searchResultEvent.emit(data)
    }).catch(error => {
      this.loading = false;
    })
  }

}
