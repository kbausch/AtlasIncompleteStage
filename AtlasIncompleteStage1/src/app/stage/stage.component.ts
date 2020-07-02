import { Component, OnChanges, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HostListener } from '@angular/core';
import { map } from 'rxjs/operators';
import { StageListModel } from '../shared/stage-list-model.model';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { CharacterListModel } from '../shared/character-list-model.model';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  animations: [
    trigger('position', [
      state('0', style({
        transform: 'translateX(-25vw)'
      })),
      state('1', style({
        transform: 'translateX(0vw)'
      })),
      state('2', style({
        transform: 'translateX(17vw)'
      })),
      state('3', style({
        transform: 'translateX(34vw)'
      })),
      state('4', style({
        transform: 'translateX(51vw)'
      })),
      state('5', style({
        transform: 'translateX(68vw)'
      })),
      state('6', style({
        transform: 'translateX(85vw)'
      })),
      state('7', style({
        transform: 'translateX(105vw)'
      })),
      transition("0 <=> 7", []),
      transition(":increment", animate('500ms ease')),
      transition(":decrement", animate('500ms ease'))
    ]),
    trigger('direction', [
      state('ArrowRight', style({
        transform: 'rotateY(0deg)'
      })),
      state('ArrowLeft', style({
        transform: 'rotateY(180deg)'
      }))
    ])
  ]
})
export class StageComponent implements OnChanges {

  characterList: CharacterListModel[];
  stage: StageListModel[];
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.getInput(event.key);
  };
  @Input('activeChar') activeChar: string;
  activeCharIndex: number;

  constructor(private db: AngularFireDatabase) {
    db.list('/characters').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe(result => { this.characterList = result; console.log(result); });
    db.list('/stage').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val(),
            index: this.characterList.indexOf(this.characterList.find(x => x.key === a.key))
          };
        });
      })).subscribe((result: any) => {
        console.log(result);
        // The reason that I have to do this unideal for-loop is because if I simply "this.stage = result" everytime
        // then the *ngFor loop will destroy and re-render each character, ruining the animations.
        if (this.stage === undefined) {
          this.stage = result;
        } else if (this.stage.length !== result.length) {
          this.stage = result;
          this.activeCharIndex = this.stage.indexOf(this.stage.find(x => x.key === this.activeChar));
        } else {
          for (let i in result) {
            this.stage[i].content.position = result[i].content.position;
            this.stage[i].content.direction = result[i].content.direction;
            this.stage[i].content.expression = result[i].content.expression;
          }
        }
      });
  }

  ngOnChanges(): void {
    if (this.activeChar) {
      this.activeCharIndex = this.stage.indexOf(this.stage.find(x => x.key === this.activeChar));
    }
  }

  getInput(key: string) {
    if (this.activeChar) {
      //console.log(key);
      const updates = {};
      updates['stage/' + this.activeChar] = {
        direction: this.stage[this.activeCharIndex].content.direction,
        position: this.stage[this.activeCharIndex].content.position,
        expression: this.stage[this.activeCharIndex].content.expression
      };

      if (key === 'ArrowRight') {
        if (this.stage[this.activeCharIndex].content.direction === 'ArrowRight') {
          if (this.stage[this.activeCharIndex].content.position > 6) {
            updates['stage/' + this.activeChar].position = 0;
          } else {
            updates['stage/' + this.activeChar].position++;
          }
        } else {
          updates['stage/' + this.activeChar].direction = 'ArrowRight';
        }
      } else if (key === 'ArrowLeft') {
        if (this.stage[this.activeCharIndex].content.direction === 'ArrowLeft') {
          if (this.stage[this.activeCharIndex].content.position < 1) {
            updates['stage/' + this.activeChar].position = 7;
          } else {
            updates['stage/' + this.activeChar].position--;
          }
        } else {
          updates['stage/' + this.activeChar].direction = 'ArrowLeft';
        }
      }
      else if (key === 'q') {
        updates['stage/' + this.activeChar].expression = 'angry';
      }
      else if (key === 'w') {
        updates['stage/' + this.activeChar].expression = 'concern';
      }
      else if (key === 'e') {
        updates['stage/' + this.activeChar].expression = 'confused';
      }
      else if (key === 'r') {
        updates['stage/' + this.activeChar].expression = 'default';
      }
      else if (key === 't') {
        updates['stage/' + this.activeChar].expression = 'furious';
      }
      else if (key === 'y') {
        updates['stage/' + this.activeChar].expression = 'happy';
      }
      else if (key === 'u') {
        updates['stage/' + this.activeChar].expression = 'kiss';
      }
      else if (key === 'i') {
        updates['stage/' + this.activeChar].expression = 'oh';
      }
      else if (key === 'o') {
        updates['stage/' + this.activeChar].expression = 'question';
      }
      else if (key === 'p') {
        updates['stage/' + this.activeChar].expression = 'sad';
      }
      else if (key === '[') {
        updates['stage/' + this.activeChar].expression = 'wink';
      }
      this.db.database.ref().update(updates);
    }
  }

}
