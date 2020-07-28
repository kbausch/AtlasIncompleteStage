// src/app/speech.service.ts
import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { words, split, floor } from 'lodash';
//import { key } from '../models/sound-key';
import MicVolumeMeter from '@adrianhurt/mic-volume-meter';

// My volume detector.
const volumeMeter = new MicVolumeMeter();

// I know... I am cheating...
//declare function require(path: string): any;
//const cmu = require('cmu-pronouncing-dictionary');

// TypeScript declaration for annyang
declare let annyang: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  //queue: number[] = [];

  activeCharacter: string;
  lastHeight: number;

  errors$ = new Subject<{ [key: string]: any }>();
  listening = false;
  indexCount = 0;

  constructor(private zone: NgZone, private db: AngularFireDatabase) { }

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {
    // Log anything the user says and what speech recognition thinks it might be
    annyang.addCallback('result', (userSaid: string[]) => {
      /*words(userSaid[0].substring(this.indexCount)).forEach(word => {
        split(cmu[word], ' ').forEach(sound => {
          if (key[sound]) {
            this.queue.push(key[sound]);
          }
        });
      });
      this.indexCount = userSaid[0].length;*/
    });
    annyang.addCallback('soundstart', () => {
      this.indexCount = 0;
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
    /*annyang.start({ continuous: false });
    const recognition = annyang.getSpeechRecognizer();
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal && event.results[i][0].transcript.length > this.indexCount) {
          annyang.trigger(event.results[i][0].transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
        } else {
          interim_transcript += event.results[i][0].transcript;
          if (event.results[i][0].confidence > .5 && this.indexCount !== interim_transcript.length) {
            annyang.trigger(interim_transcript);
          }
        }
      }
    }*/
    /*setInterval(() => {
      if (this.queue[0] !== undefined) {
        const updates = {};
        updates['stage/mouthy/expression'] = this.queue.shift();
        return this.db.database.ref().update(updates);
      }
    }, 100);*/
    volumeMeter.switchOn() // switches on the MicVolumeMeter
      .then(() => {
        const onThisNewMeasure = ({ volume, time }) => {
          const vol = floor(volume * 100);
          if (this.activeCharacter && vol !== this.lastHeight) {
            //console.log(vol, time);
            const updates = {};
            updates['stage/' + this.activeCharacter + '/height'] = vol;
            this.lastHeight = vol;
            this.db.database.ref().update(updates);
          }
        };
        // starts the MicVolumeMeter that will call onNewMeasure each 100 milliseconds
        volumeMeter.start({ onNewMeasure: onThisNewMeasure, interval: 75 });
      })
      .catch(() => alert('Permission denied!'));
    this.listening = true;
  }

  abort() {
    //annyang.abort();
    volumeMeter.switchOff();
    this.indexCount = 0;
    this.listening = false;
  }

  addActiveChar(char: string): void {
    this.activeCharacter = char;
  }

}
