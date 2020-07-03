import { Component, OnChanges, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HostListener } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { map } from 'rxjs/operators';

import { StageListModel } from '../shared/stage-list-model.model';
import { CharacterListModel } from '../shared/character-list-model.model';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

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
        transform: 'translateX(16vw)'
      })),
      state('3', style({
        transform: 'translateX(32vw)'
      })),
      state('4', style({
        transform: 'translateX(48vw)'
      })),
      state('5', style({
        transform: 'translateX(64vw)'
      })),
      state('6', style({
        transform: 'translateX(80vw)'
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
    ]),
    trigger('level', [
      state('0', style({
        transform: 'translateY(100%)'
      })),
      state('1', style({
        transform: 'translateY(0%)'
      })),
      transition("1 => 0", animate('300ms ease-in')),
      transition("0 => 1", animate('300ms ease-out'))
    ])
  ]
})
export class StageComponent implements OnChanges {

  height: object = {
    height: '60vh'
  };

  characterList: CharacterListModel[];
  stage: StageListModel[];
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.getInput(event.key);
  };
  @HostListener('document:keydown', ['$event'])
  stopUpDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || 'ArrowDown') {
      event.preventDefault();
    }
  };
  @Input('activeChar') activeChar: string;
  activeCharIndex: number;

  img: string;
  imgInput = false;

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
      })).subscribe((result: any[]) => {
        console.log(result);
        // The reason that I have to do this unideal for-loop is because if I simply "this.stage = result" everytime
        // then the *ngFor loop will destroy and re-render each character, ruining the animations.

        if (this.stage === undefined) {
          this.stage = result;
          this.img = result[result.indexOf(result.find(x => x.key === 'img'))].content;
        } else if (this.stage.length !== result.length) {
          this.stage = result;
          this.activeCharIndex = this.stage.indexOf(this.stage.find(x => x.key === this.activeChar));
        } else {
          for (let i in result) {
            if (this.stage[i].key !== 'img') {
              this.stage[i].content.position = result[i].content.position;
              this.stage[i].content.direction = result[i].content.direction;
              this.stage[i].content.expression = result[i].content.expression;
              this.stage[i].content.visible = result[i].content.visible;
              this.stage[i].content.level = result[i].content.level;
            } else if (this.stage[i].content !== result[i].content) {
              //This else if will fire if the img is different
              this.stage[i].content = result[i].content;
              this.img = result[i].content;
            }
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
        expression: this.stage[this.activeCharIndex].content.expression,
        visible: this.stage[this.activeCharIndex].content.visible,
        level: this.stage[this.activeCharIndex].content.level,
      };

      if (key === 'ArrowRight') {
        if (this.stage[this.activeCharIndex].content.direction === 'ArrowRight') {
          if (this.stage[this.activeCharIndex].content.position === 7) {
            updates['stage/' + this.activeChar].position = 0;
          } else {
            updates['stage/' + this.activeChar].position++;
          }
        } else {
          updates['stage/' + this.activeChar].direction = 'ArrowRight';
        }
      } else if (key === 'ArrowLeft') {
        if (this.stage[this.activeCharIndex].content.direction === 'ArrowLeft') {
          if (this.stage[this.activeCharIndex].content.position === 0) {
            updates['stage/' + this.activeChar].position = 7;
          } else {
            updates['stage/' + this.activeChar].position--;
          }
        } else {
          updates['stage/' + this.activeChar].direction = 'ArrowLeft';
        }
      }
      else if (key === 'ArrowUp') {
        updates['stage/' + this.activeChar].level = 1;
      }
      else if (key === 'ArrowDown') {
        updates['stage/' + this.activeChar].level = 0;
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
      else if (key === 'v') {
        updates['stage/' + this.activeChar].visible = !updates['stage/' + this.activeChar].visible;
      }
      this.db.database.ref().update(updates);
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    this.height = {
      height: `${event.rectangle.height}px`
    };
  }


}
