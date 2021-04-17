import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemGenComponent } from '../problem-gen/problem-gen.component'
import { GameEngineComponent } from './game-engine.component';



@NgModule({
  declarations: [GameEngineComponent],
  bootstrap: [GameEngineComponent],
  imports: [
    ProblemGenComponent,
    CommonModule,
  ]
})
export class GameEngineModule { }
