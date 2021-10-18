import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Game } from '../interfaces/game';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input()
  searchResult!: Game[];
  public searchSlice: Game[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.searchSlice = this.searchResult.slice(0,10);
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.searchResult.length) {
      endIndex = this.searchResult.length
    }
    this.searchSlice = this.searchResult.slice(startIndex, endIndex);
  }

}
