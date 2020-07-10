import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CharacterListModel } from '../shared/models/character-list-model.model';
import { StageListModel } from '../shared/models/stage-list-model.model';
import { Subscription } from 'rxjs';
import { DataretrieverService } from '../shared/services/dataretriever.service';
import { invert, find } from 'lodash';

@Component({
  selector: 'app-control-panel1',
  templateUrl: './control-panel1.component.html',
  styleUrls: ['./control-panel1.component.scss']
})
export class ControlPanel1Component implements OnInit, OnDestroy {

  stageList: StageListModel[];
  characterList: CharacterListModel[];

  selectedChar: string;
  @Output('activeChar') activeChar = new EventEmitter<string>();

  emotes: { [key: string]: string };
  emoteBinds: object;

  private stageSub: Subscription;
  private charSub: Subscription;

  insertIMG: string;
  insertAnim: string;

  constructor(private dr: DataretrieverService) {
    // .query.once('value').then(result => this.stageList = result.toJSON())
    this.emoteBinds = invert(dr.emoteBinds);
    this.stageSub = dr.getStage().subscribe(result => this.stageList = result);
    this.charSub = this.dr.getCharacters().subscribe(result => this.characterList = result);
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
        level: 1
      };
      return this.dr.update(updates);
    }
  }

  selectChar(key: string): void {
    this.selectedChar = key;
    this.emotes = find(this.characterList, function(o: CharacterListModel) { return o.key === key; }).content;
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
  }

}
