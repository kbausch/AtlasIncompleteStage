// src/app/listen/listen.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechService } from '../shared/services/speech.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit, OnDestroy {
  errorsSub: Subscription;
  errorMsg: string;

  constructor(public speech: SpeechService) { }

  ngOnInit() {
    //this.speech.init();
    this._listenErrors();
  }

  get btnLabel(): string {
    return this.speech.listening ? 'Listening...' : 'Listen';
  }

  private _listenErrors() {
    this.errorsSub = this.speech.errors$
      .subscribe(err => this._setError(err));
  }

  private _setError(err?: any) {
    if (err) {
      console.log('Speech Recognition:', err);
      this.errorMsg = err.message;
    } else {
      this.errorMsg = null;
    }
  }

  changeIntensity(range: number) {
    this.speech.level = range;
  }

  toggleCeiling(ceiling: boolean) {
    this.speech.ceiling = ceiling;
  }

  ngOnDestroy() {
    this.errorsSub.unsubscribe();
  }

}