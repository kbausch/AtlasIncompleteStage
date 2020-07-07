import { Component, OnChanges, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { position, level, direction } from '../shared/character-animation.animation';

import { StageListModel } from '../shared/models/stage-list-model.model';
import { CharacterListModel } from '../shared/models/character-list-model.model';
import { DataretrieverService } from '../shared/services/dataretriever.service';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  animations: [position, direction, level]
})
export class StageComponent implements OnChanges {

  height: object = {
    height: '60vh'
  };

  @Input('activeChar') activeChar: string;
  activeCharIndex: number;

  img: string;
  imgInput = false;

  characterList: CharacterListModel[];
  stage: StageListModel[];

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.activeChar) {
      this.getInput(event.key);
    }
  }
  @HostListener('document:keydown', ['$event'])
  stopUpDown(event: KeyboardEvent) {
    if (event.keyCode === 40) {
      event.preventDefault();
    }
  }

  constructor(private dr: DataretrieverService) {
    this.dr.getCharacters().subscribe(result => this.subStage(result));
  }

  ngOnChanges(): void {
    if (this.activeChar) {
      this.activeCharIndex = this.stage.indexOf(this.stage.find(x => x.key === this.activeChar));
    }
  }

  private subStage(result: CharacterListModel[]) {
    this.characterList = result;
    this.dr.getStage(result).subscribe((result: any[]) => {
      // The reason that I have to do this unideal for-loop is because if I simply "this.stage = result" everytime
      // then the *ngFor loop will destroy and re-render each character, ruining the animations.

      if (this.stage === undefined) {
        this.stage = result;
        this.img = result[result.indexOf(result.find(x => x.key === 'img'))].content;
      } else if (this.stage.length !== result.length) {
        this.stage = result;
        this.activeCharIndex = this.stage.indexOf(this.stage.find(x => x.key === this.activeChar));
      } else {
        for (const i in result) {
          if (this.stage[i].key !== 'img') {
            this.stage[i].content.position = result[i].content.position;
            this.stage[i].content.direction = result[i].content.direction;
            this.stage[i].content.expression = result[i].content.expression;
            this.stage[i].content.visible = result[i].content.visible;
            this.stage[i].content.level = result[i].content.level;
          } else if (this.stage[i].content !== result[i].content) {
            // This else if will fire if the img is different
            this.stage[i].content = result[i].content;
            this.img = result[i].content;
          }
        }
      }
    });
  }

  getInput(key: string) {
    // console.log(key);
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
    else if (key === 'v') {
      updates['stage/' + this.activeChar].visible = !updates['stage/' + this.activeChar].visible;
    }
    else if(this.dr.emoteBinds[key]){
      updates['stage/' + this.activeChar].expression = this.dr.emoteBinds[key];
    }
    this.dr.update(updates);
  }

  onResizeEnd(event: ResizeEvent): void {
    this.height = {
      height: `${event.rectangle.height}px`
    };
  }


}
