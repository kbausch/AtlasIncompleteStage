import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CharacterListModel } from '../shared/models/character-list-model.model';
import { StageListModel } from '../shared/models/stage-list-model.model';
import { Subscription } from 'rxjs';
import { DataretrieverService } from '../shared/services/dataretriever.service';
import { SpeechService } from '../shared/services/speech.service';
import { invert, find, pickBy, has, assign } from 'lodash';

@Component({
  selector: 'app-control-panel1',
  templateUrl: './control-panel1.component.html',
  styleUrls: ['./control-panel1.component.scss']
})
export class ControlPanel1Component implements OnInit, OnDestroy {

  stageList: StageListModel[];
  characterList: CharacterListModel[];

  private selectedChar: string;
  @Output('activeChar') activeChar = new EventEmitter<string>();

  emotes: { [key: string]: string };
  emoteBinds: object;
  private bindPreferences: object = {
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

  private dmgKey = [
    'https://i.imgur.com/0RIJTU9.png',
    'https://i.imgur.com/LiL94tY.png',
    'https://i.imgur.com/znEr3zU.png',
    'https://i.imgur.com/CPBppEp.png',
    'https://i.imgur.com/0ZZITRQ.png',
    'https://i.imgur.com/kSzM6uB.png',
    'https://i.imgur.com/ZI54aj4.png',
    'https://i.imgur.com/IG2VoO7.png',
    'https://i.imgur.com/cxKtMVa.png',
    'https://i.imgur.com/QeIzSzr.png'
  ];
  dmgAmount: number;

  private stageSub: Subscription;
  private charSub: Subscription;

  masterToggle: boolean;
  insertIMG: string;
  insertAnim: string;

  constructor(private dr: DataretrieverService, private sp: SpeechService) {
    // .query.once('value').then(result => this.stageList = result.toJSON())
    this.stageSub = dr.getStage().subscribe(result => {
      this.stageList = result;
      if (this.selectedChar && !(this.stageList.find(character => character.key === this.selectedChar))) {
        this.selectedChar = null;
        this.activeChar.emit(null);
        sp.addActiveChar(null);
        this.emotes = null;
      }
    });
    this.charSub = dr.getCharacters().subscribe(result => this.characterList = result);
    dr.addBinds(this.bindPreferences);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stageSub.unsubscribe();
    this.charSub.unsubscribe();
  }

  toggleChar(key: string): Promise<any> {
    if (this.stageList.find(x => x.key === key)) {
      if (this.selectedChar === key) {
        this.selectedChar = null;
        this.activeChar.emit(null);
        this.sp.addActiveChar(null);
        this.emotes = null;
      }
      return this.dr.remove('stage/' + key);
    } else {
      const updates = {};
      updates['stage/' + key] = {
        direction: 'ArrowRight',
        position: 0,
        expression: 'default',
        visible: true,
        level: 1,
        zindex: 1,
        height: 0
      };
      return this.dr.update(updates);
    }
  }

  selectChar(key: string): void {
    this.selectedChar = key;
    this.emotes = find(this.characterList, (o: CharacterListModel) => o.key === key).content;
    this.dr.addBinds(pickBy(this.bindPreferences, (value) => has(this.emotes, value)));
    this.emoteBinds = invert(this.dr.emoteBinds);
    this.sp.addActiveChar(key);
    return this.activeChar.emit(key);
  }

  addImg(img: string): Promise<any> {
    const updates = {};
    updates['stage/img'] = img;
    this.insertIMG = null;
    return this.dr.update(updates);
  }

  addAnimation(img: string): Promise<any> {
    const updates = {};
    updates['stage/animation'] = img;
    this.insertAnim = null;
    return this.dr.update(updates);
  }

  bindEmote() {
    this.dr.addBinds(invert(this.emoteBinds));
    assign(this.bindPreferences, this.dr.emoteBinds);
  }

  clearStage(softClear: boolean, direction?: string, position?: number): Promise<any> {
    const newStage = {};
    if (!softClear) {
      newStage['stage/img'] = this.stageList.find(character => character.key === 'img').content;
      this.dr.remove('stage');
      return this.dr.update(newStage);
    }
    this.stageList.forEach(character => {
      if (character.key !== 'img' && character.key !== 'animation') {
        if (direction) {
          newStage['stage/' + character.key + '/direction'] = direction;
          newStage['stage/' + character.key + '/position'] = position;
        } else {
          if (character.content.position < 7) {
            newStage['stage/' + character.key + '/direction'] = 'ArrowLeft';
            newStage['stage/' + character.key + '/position'] = 0;
          } else {
            newStage['stage/' + character.key + '/direction'] = 'ArrowRight';
            newStage['stage/' + character.key + '/position'] = 14;
          }
        }
      }
    });
    return this.dr.update(newStage);
  }

  doDMG(all?: boolean): Promise<any> {
    const newStage = {};
    if (all) {
      this.stageList.forEach(char => {
        if (char.key !== 'img' && char.key !== 'animation') {
          newStage['stage/' + char.key + '/damageAnimation'] = this.dmgKey[this.dmgAmount - 1] + '#' + (new Date().getTime());
        }
      });
      return this.dr.update(newStage);
    }
    if (this.dmgKey[this.dmgAmount - 1]) {
      newStage['stage/' + this.selectedChar + '/damageAnimation'] = this.dmgKey[this.dmgAmount - 1] + '#' + (new Date().getTime());
    } else {
      this.dr.remove('stage/' + this.selectedChar + '/damageAnimation');
    }
    return this.dr.update(newStage);
  }

  cleanDMGBuffer(all: boolean) {
    if (all) {
      this.stageList.forEach(char => {
        if (char.key !== 'img' && char.key !== 'animation') {
          this.dr.remove('stage/' + char.key + '/damageAnimation');
        }
      });
      return;
    } else {
      return this.dr.remove('stage/' + this.selectedChar + '/damageAnimation');
    }
  }

}
