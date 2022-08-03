import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { PlayerService, Track } from '../../../../@core/utils/player.service';

@Component({
  selector: 'ngx-player',
  styleUrls: ['./player.component.scss'],
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnDestroy {
  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean | undefined;

  track: Track;
  player: any | undefined;
  shuffle: boolean | undefined;

  constructor(private playerService: PlayerService) {
    this.track = this.playerService.random();
    this.createPlayer();
  }

  ngOnDestroy() {
    if(this.player) {
    this.player.pause();
    this.player.src = '';
    this.player.load();
    }
  }

  prev() {
    if (!this.player?.loop) {
      if (this.shuffle) {
        this.track = this.playerService.random();
      } else {
        this.track = this.playerService.prev();
      }
    }

    this.reload();
  }

  next() {
    if (!this.player?.loop) {
      if (this.shuffle) {
        this.track = this.playerService.random();
      } else {
        this.track = this.playerService.next();
      }
    }

    this.reload();
  }

  playPause() {
    if (this.player?.paused) {
      this.player.play();
    } else {
      this.player?.pause();
    }
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  toggleLoop() {
    if(this.player){
    this.player.loop = !this.player?.loop;
    }
  }

  setVolume(volume: any) {
    if(this.player){
      this.player.volume = volume / 100;
    }
  }

  getVolume(): number|undefined {
    if(this.player){
      return this.player.volume * 100;
    }
    return 1;
  }

  setProgress(duration: any) {
    if(this.player)
    this.player.currentTime = this.player.duration * duration / 100;
  }

  getProgress(): number| undefined {
    if(this.player) {
    return this.player.currentTime / this.player.duration * 100 || 0;
    }
    return 10;
  }

  private createPlayer() {
    this.player = new Audio();
    this.player.onended = () => this.next();
    this.setTrack();
  }

  private reload() {
    this.setTrack();
    if(this.player)
    this.player.play();
  }

  private setTrack() {
    if(this.player){
    //this.player.src = this.track.url;
    this.player.load();
    }
  }
}
