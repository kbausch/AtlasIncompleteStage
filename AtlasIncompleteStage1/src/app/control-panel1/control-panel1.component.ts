import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { CharacterListModel } from '../shared/character-list-model.model';
import { StageListModel } from '../shared/stage-list-model.model';

@Component({
  selector: 'app-control-panel1',
  templateUrl: './control-panel1.component.html',
  styleUrls: ['./control-panel1.component.scss']
})
export class ControlPanel1Component implements OnInit {

  stageList: StageListModel[];
  characterList: CharacterListModel[];
  @Output('activeChar') activeChar = new EventEmitter<string>();

  constructor(private db: AngularFireDatabase) {
    // .query.once('value').then(result => this.stageList = result.toJSON())
    db.list('/stage').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe(result => { this.stageList = result;});
    db.list('/characters').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe(result => { this.characterList = result;});
  }

  ngOnInit(): void {
  }

  toggleChar(key: string): Promise<any> {
    const updates = {};
    if (this.stageList.find(x => x.key === key)) {
      this.activeChar.emit(null);
      return this.db.database.ref().child('stage/' + key).remove();
    } else {
      console.log("Adding it!");
      updates['stage/' + key] = {
        direction: 'ArrowRight',
        position: 0,
        expression: 'default'
      };
      return this.db.database.ref().update(updates);
    }
  }

}
