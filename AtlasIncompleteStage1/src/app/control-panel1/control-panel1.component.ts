import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { CharacterListModel } from '../shared/character-list-model.model';
import { StageListModel } from '../shared/stage-list-model.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-panel1',
  templateUrl: './control-panel1.component.html',
  styleUrls: ['./control-panel1.component.scss']
})
export class ControlPanel1Component implements OnInit, OnDestroy {

  stageList: StageListModel[];
  characterList: CharacterListModel[];
  @Output('activeChar') activeChar = new EventEmitter<string>();
  stageSub: Subscription;
  charSub: Subscription;
  selectedChar: string;
  emotes: { [key: string]: string };

  insertIMG: string;

  constructor(private db: AngularFireDatabase) {
    // .query.once('value').then(result => this.stageList = result.toJSON())
    this.stageSub = db.list('/stage').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe(result => { this.stageList = result; });
    this.charSub = db.list('/characters').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe((result: CharacterListModel[]) => this.characterList = result);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stageSub.unsubscribe();
    this.charSub.unsubscribe();
  }

  toggleChar(key: string): Promise<any> {
    const updates = {};
    if (this.stageList.find(x => x.key === key)) {
      if (this.selectedChar === key) {
        this.selectedChar = null;
        this.activeChar.emit(null);
        this.emotes = null;
      }
      return this.db.database.ref().child('stage/' + key).remove();
    } else {
      updates['stage/' + key] = {
        direction: 'ArrowRight',
        position: 0,
        expression: 'default',
        visible: true
      };
      return this.db.database.ref().update(updates);
    }
  }

  selectChar(key: string) {
    this.selectedChar = key;
    this.emotes = this.characterList[this.characterList.indexOf(this.characterList.find(x => x.key === key))].content;
    this.activeChar.emit(key);
  }

  addImg(img: string): Promise<any> {
    const updates = {};
    updates['stage/img'] = img;
    this.insertIMG = null;
    return this.db.database.ref().update(updates);
  }

}
