import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
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
        transform: 'translateX(0%)'
      })),
      state('1', style({
        transform: 'translateX(25%)'
      })),
      state('2', style({
        transform: 'translateX(50%)'
      })),
      state('3', style({
        transform: 'translateX(75%)'
      })),
      state('4', style({
        transform: 'translateX(100%)'
      })),
      state('5', style({
        transform: 'translateX(125%)'
      })),
      state('6', style({
        transform: 'translateX(150%)'
      }))
    ])
  ]
})
export class StageComponent implements OnInit {

  characterList: object;
  stage: object;
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.getInput(event.key);
  };

  constructor(private db: AngularFireDatabase) {
    db.list('/characters').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return a.payload.val();
        });
      })).subscribe(result => this.characterList = result);
    db.list('/stage').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          return {
            key: a.key,
            content: a.payload.val()
          };
        });
      })).subscribe(result => {
        this.stage = result;
        console.log(this.stage);
      });
  }

  ngOnInit(): void {
  }

  addSteve() {
    const updates = {
      'stage/steve': {
        position: '1',
        expression: 'default'
      }
    };
    this.db.database.ref().update(updates);
  }

  getInput(key: string) {
    console.log(key);
    const updates = {};
    if (key === 'ArrowRight') {
      if (this.stage[0].content.position > 5) {
        updates['stage/steve'] = {
          position: 0,
          expression: this.stage[0].content.expression
        };
      } else {
        updates['stage/steve'] = {
          position: this.stage[0].content.position + 1,
          expression: this.stage[0].content.expression
        };
      }
    } else if (key === 'ArrowLeft') {
      if (this.stage[0].content.position < 1) {
        updates['stage/steve'] = {
          position: 6,
          expression: this.stage[0].content.expression
        };
      } else {
        updates['stage/steve'] = {
          position: this.stage[0].content.position - 1,
          expression: this.stage[0].content.expression
        };
      }
    }
    else if (key === 'q') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'angry'
      };
    }
    else if (key === 'w') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'concern'
      };
    }
    else if (key === 'e') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'confused'
      };
    }
    else if (key === 'r') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'default'
      };
    }
    else if (key === 't') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'furious'
      };
    }
    else if (key === 'y') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'happy'
      };
    }
    else if (key === 'u') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'kiss'
      };
    }
    else if (key === 'i') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'oh'
      };
    }
    else if (key === 'o') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'question'
      };
    }
    else if (key === 'p') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'sad'
      };
    }
    else if (key === '[') {
      updates['stage/steve'] = {
        position: this.stage[0].content.position,
        expression: 'wink'
      };
    }
    this.db.database.ref().update(updates);
  }
}
