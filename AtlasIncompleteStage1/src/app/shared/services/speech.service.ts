// src/app/speech.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

// TypeScript declaration for annyang
declare var annyang: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  words$ = new Subject<{ [key: string]: string }>();
  errors$ = new Subject<{ [key: string]: any }>();
  listening = false;

  constructor(private zone: NgZone) { }

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {

    // Log anything the user says and what speech recognition thinks it might be
    annyang.addCallback('result', (userSaid) => {
      console.log('User may have said:', userSaid);
    });
    annyang.addCallback('errorNetwork', (err) => {
      this._handleError('network', 'A network error occurred.', err);
    });
    annyang.addCallback('errorPermissionBlocked', (err) => {
      this._handleError('blocked', 'Browser blocked microphone permissions.', err);
    });
    annyang.addCallback('errorPermissionDenied', (err) => {
      this._handleError('denied', 'User denied microphone permissions.', err);
    });
  }

  private _handleError(error, msg, errObj) {
    this.zone.run(() => {
      this.errors$.next({
        error: error,
        message: msg,
        obj: errObj
      });
    });
  }

  startListening() {
    annyang.start({ continuous: true });
    var recognition = annyang.getSpeechRecognizer();
    var final_transcript = '';
    recognition.interimResults = true;
    recognition.onresult = function (event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript = '';
          final_transcript += event.results[i][0].transcript;
          console.log("final_transcript=" + final_transcript);
          annyang.trigger(final_transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
          
        } else {
          //console.log(i + ": " + event.results[i][0].transcript);
          interim_transcript += event.results[i][0].transcript;
        }
      }
      console.log("interim_transcript=" + interim_transcript);
    }
    this.listening = true;
  }

  abort() {
    annyang.abort();
    this.listening = false;
  }

}
