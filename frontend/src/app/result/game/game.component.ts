import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Game } from 'src/app/interfaces/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public panelOpenState: boolean = false;

  @ViewChild('videoPlayer')
  videoplayer!: ElementRef;
  @Input() game!: Game;

  constructor() { }

  ngOnInit(): void {
  }

  toggleVideo(event: any) {
      this.videoplayer.nativeElement.play();
  }

}
