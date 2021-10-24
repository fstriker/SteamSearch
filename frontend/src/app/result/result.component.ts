import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Game } from '../interfaces/game';
import { Search } from '../interfaces/search';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator:MatPaginator = {} as MatPaginator;

  @Input()
  searchResult!: Search;
  public searchSlice: Game[] = [];

  constructor(public backendService: BackendService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.paginator.pageIndex = 0;
    this.searchSlice = this.searchResult?.games;
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    this.backendService.getSearchResult(
      this.searchResult.name,
      this.searchResult.genres,
      this.searchResult.platform,
      this.searchResult.publisher,
      this.searchResult.developer,
      this.searchResult.categories,
      startIndex).then((data: Search) => {
        this.searchResult = data;
        this.searchSlice = data.games;
      })
  }

}
