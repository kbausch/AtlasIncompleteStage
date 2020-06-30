import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-control-panel1',
  templateUrl: './control-panel1.component.html',
  styleUrls: ['./control-panel1.component.scss']
})
export class ControlPanel1Component implements OnInit {

  stageList: object[];
  characterList: object;
  @Output('charNum') charNum = new EventEmitter<number>();

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
      })).subscribe(result => { this.stageList = result; console.log(this.stageList); });
      db.list('/characters').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            return {
              key: a.key,
              content: a.payload.val()
            };
          });
        })).subscribe(result => { this.characterList = result; console.log(this.characterList); });
  }

  ngOnInit(): void {
  }

  addChar(key: string){
    const updates = {};
    updates['stage/'+ key] = {
      direction: 'ArrowRight',
      position: 0,
      expression: 'default'
    };
    this.db.database.ref().update(updates);
  }

}
