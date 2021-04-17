import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemGenComponent } from './problem-gen.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [ProblemGenComponent],
  imports: [
    CommonModule,
    MatCardModule,
    NgModule
  ]
})
export class ProblemGenModule { }
