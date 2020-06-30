import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HostListener } from '@angular/core';
import {map} from 'rxjs/operators';

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
      })),
      transition("* => *", animate('100ms ease'))
    ])
  ]
})
export class StageComponent implements OnInit {

  characterList: object;
  stage: object;
  lastmove = 'ArrowRight';
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.getInput(event.key);
  };
  @Input('charNum') charNum: number;

  constructor(private db: AngularFireDatabase) {
    db.list('/characters').valueChanges().subscribe(result => {this.characterList = result});
    db.list('/stage').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe((result: any) => {
        console.log(result);
      // The reason that I have to do this unideal for-loop is because if I simply "this.stage = result" everytime
      // then the *ngFor loop will destroy and re-render each character, ruining the animations.
      for (let i in result) {
        if (this.stage === undefined) {
          this.stage = result;
        } else {
          this.stage[i].content.position = result[i].content.position;
          this.stage[i].content.direction = result[i].content.direction;
          this.stage[i].content.expression = result[i].content.expression;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  getInput(key: string) {
    const characterName = this.stage[this.charNum].key;
    //console.log(key);
    const updates = {};
    updates['stage/'+characterName] = {
      direction: this.lastmove,
      position: this.stage[this.charNum].content.position,
      expression: this.stage[this.charNum].content.expression
    };

    if (key === 'ArrowRight') {
      if (this.lastmove === 'ArrowRight') {
        if (this.stage[this.charNum].content.position > 6) {
          updates['stage/'+characterName].position = 0;
        } else {
          updates['stage/'+characterName].position++;
        }
      } else {
        this.lastmove = 'ArrowRight';
        updates['stage/'+characterName].direction = this.lastmove;
      }
    } else if (key === 'ArrowLeft') {
      if (this.lastmove === 'ArrowLeft') {
        if (this.stage[this.charNum].content.position < 1) {
          updates['stage/'+characterName].position = 7;
        } else {
          updates['stage/'+characterName].position--;
        }
      } else {
        this.lastmove = 'ArrowLeft';
        updates['stage/'+characterName].direction = this.lastmove;
      }
    }
    else if (key === 'q') {
      updates['stage/'+characterName].expression = 'angry';
    }
    else if (key === 'w') {
      updates['stage/'+characterName].expression = 'concern';
    }
    else if (key === 'e') {
      updates['stage/'+characterName].expression = 'confused';
    }
    else if (key === 'r') {
      updates['stage/'+characterName].expression = 'default';
    }
    else if (key === 't') {
      updates['stage/'+characterName].expression = 'furious';
    }
    else if (key === 'y') {
      updates['stage/'+characterName].expression = 'happy';
    }
    else if (key === 'u') {
      updates['stage/'+characterName].expression = 'kiss';
    }
    else if (key === 'i') {
      updates['stage/'+characterName].expression = 'oh';
    }
    else if (key === 'o') {
      updates['stage/'+characterName].expression = 'question';
    }
    else if (key === 'p') {
      updates['stage/'+characterName].expression = 'sad';
    }
    else if (key === '[') {
      updates['stage/'+characterName].expression = 'wink';
    }
    this.db.database.ref().update(updates);
  }

}
