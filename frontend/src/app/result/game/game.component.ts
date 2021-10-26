import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-video-gallery';
import { Game } from 'src/app/interfaces/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('videoPlayer')
  videoplayer!: ElementRef;
  public panelOpenState: boolean = false;
  @Input() game!: Game;

  constructor() { }

  ngOnInit(): void {
  }

  playVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  pauseVideo(event: any) {
    this.videoplayer.nativeElement.pause();
  }

}
