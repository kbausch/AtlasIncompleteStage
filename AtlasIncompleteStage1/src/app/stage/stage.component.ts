import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HostListener } from '@angular/core';

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
        transform: 'translateX(-25%)'
      })),
      state('1', style({
        transform: 'translateX(0%)'
      })),
      state('2', style({
        transform: 'translateX(17%)'
      })),
      state('3', style({
        transform: 'translateX(34%)'
      })),
      state('4', style({
        transform: 'translateX(51%)'
      })),
      state('5', style({
        transform: 'translateX(68%)'
      })),
      state('6', style({
        transform: 'translateX(85%)'
      })),
      state('7', style({
        transform: 'translateX(105%)'
      })),
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
export class StageComponent implements OnInit {

  characterList: object;
  stage: object;
  lastmove = 'ArrowRight';
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.getInput(event.key);
  };

  constructor(private db: AngularFireDatabase) {
    db.list('/characters').valueChanges().subscribe(result => this.characterList = result);
    db.list('/stage').valueChanges().subscribe((result: any) => {
      // The reason that I have to do this unideal for-loop is because if I simply "this.stage = result" everytime
      // then the *ngFor loop will destroy and re-render each character, ruining the animations.
      for (let i in result) {
        if (this.stage === undefined) {
          this.stage = result;
        } else {
          this.stage[i].position = result[i].position;
          this.stage[i].direction = result[i].direction;
          this.stage[i].expression = result[i].expression;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  addSteve() {
    const updates = {
      'stage/steve': {
        direction: this.lastmove,
        position: '1',
        expression: 'default'
      }
    };
    this.db.database.ref().update(updates);
  }

  getInput(key: string) {
    //console.log(key);
    const updates = {};
    updates['stage/steve'] = {
      direction: this.lastmove,
      position: this.stage[0].position,
      expression: this.stage[0].expression
    };
    if (key === 'ArrowRight') {
      if (this.lastmove === 'ArrowRight') {
        if (this.stage[0].position > 6) {
          updates['stage/steve'].position = 0;
        } else {
          updates['stage/steve'].position++;
        }
      } else {
        this.lastmove = 'ArrowRight';
        updates['stage/steve'].direction = this.lastmove;
      }
    } else if (key === 'ArrowLeft') {
      if (this.lastmove === 'ArrowLeft') {
        if (this.stage[0].position < 1) {
          updates['stage/steve'].position = 7;
        } else {
          updates['stage/steve'].position--;
        }
      } else {
        this.lastmove = 'ArrowLeft';
        updates['stage/steve'].direction = this.lastmove;
      }
    }
    else if (key === 'q') {
      updates['stage/steve'].expression = 'angry';
    }
    else if (key === 'w') {
      updates['stage/steve'].expression = 'concern';
    }
    else if (key === 'e') {
      updates['stage/steve'].expression = 'confused';
    }
    else if (key === 'r') {
      updates['stage/steve'].expression = 'default';
    }
    else if (key === 't') {
      updates['stage/steve'].expression = 'furious';
    }
    else if (key === 'y') {
      updates['stage/steve'].expression = 'happy';
    }
    else if (key === 'u') {
      updates['stage/steve'].expression = 'kiss';
    }
    else if (key === 'i') {
      updates['stage/steve'].expression = 'oh';
    }
    else if (key === 'o') {
      updates['stage/steve'].expression = 'question';
    }
    else if (key === 'p') {
      updates['stage/steve'].expression = 'sad';
    }
    else if (key === '[') {
      updates['stage/steve'].expression = 'wink';
    }
    this.db.database.ref().update(updates);
  }

  logAnimation($event) {
    console.log($event)
  }
}
