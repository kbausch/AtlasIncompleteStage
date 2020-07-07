import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { CharacterListModel } from '../models/character-list-model.model';
import { Observable } from 'rxjs';
import { StageListModel } from '../models/stage-list-model.model';

@Injectable({
  providedIn: 'root'
})
export class DataretrieverService {

  emoteBinds: object = {
    'q': 'angry',
    'w': 'concern',
    'e': 'confused',
    'r': 'default',
    't': 'furious',
    'y': 'happy',
    'u': 'kiss',
    'i': 'oh',
    'o': 'question',
    'p': 'sad',
    '[': 'wink',
    'f': 'festive'
  };

  constructor(private db: AngularFireDatabase) { }

  getCharacters(): Observable<CharacterListModel[]> {
    return this.db.list('/characters').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      }));
  }

  getStage(characters?: CharacterListModel[]): Observable<StageListModel[]> {
    if (characters) {
      return this.db.list('/stage').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            return {
              key: a.key,
              content: a.payload.val(),
              index: characters.indexOf(characters.find(x => x.key === a.key))
            };
          });
        }));
    } else {
      return this.db.list('/stage').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            return {
              key: a.key,
              content: a.payload.val()
            };
          });
        }));
    }
  }

  update(updates: object): Promise<any> {
    return this.db.database.ref().update(updates);
  }

  remove(key: string): Promise<any> {
    return this.db.database.ref().child(key).remove();
  }

  addBinds(emote: object) {
    this.emoteBinds = emote;
  }
}
