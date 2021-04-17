import { Component, OnInit } from '@angular/core';
import { Answer, Problem } from './problem.model';

@Component({
  selector: 'app-problem-gen',
  templateUrl: './problem-gen.component.html',
  styleUrls: ['./problem-gen.component.scss']
})
export class ProblemGenComponent implements OnInit {
  numberOfProblems: number = 3;
  index: number = 0;
  quizScore: number;
  problemSet: Problem[];  
  currentProblem: Problem;
  problemResponse: string[] = ["Wrong my friend.", "Right on the money!"]
  currentMessage: string;
  isQuizDone: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.problemSet = this.generateProblems();
    this.currentProblem = this.problemSet[this.index];
    console.log(this.currentProblem);
  }

  generateProblems(): Problem[]{
    let probSet =  Array<Problem>();    
    for(let j = 0; j < this.numberOfProblems; j++){
      let tmp = this.generateProblem();
      probSet.push(tmp);      
    }
    return probSet;
  }

  generateProblem(): Problem {
    let tempProblem = new Problem();
    tempProblem.firstDigit = this.randomNumber(1, 11);
    tempProblem.secondDigit = this.randomNumber(1, 11);
    tempProblem.answer = tempProblem.firstDigit * tempProblem.secondDigit; 

    for(let i = 0; i < tempProblem.possibleAnswers.length; i++){
      let num = new Answer(this.randomNumber(1, 11) * this.randomNumber(1, 11));
      if(i == 0){
        num = new Answer(tempProblem.answer);        
      }
      tempProblem.possibleAnswers[i] = num;
    }
    this.shuffle(tempProblem.possibleAnswers);
    return tempProblem;    
  }

  randomNumber(min, max): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  checkAnswer(val){
    this.currentProblem.isAnswered = true;
    if(val == this.currentProblem.answer){      
      this.currentProblem.isCorrect = true;
      this.currentMessage = this.problemResponse[1];
    }
    else{
      this.currentMessage = this.problemResponse[0];
    }
  }

  nextQuestions(){
    this.index++;
    if(this.index == this.problemSet.length){
      this.endQuiz();
    }
    else{
      this.currentProblem = this.problemSet[this.index];
    }
    this.currentMessage = "";    
  }

  endQuiz(){
    this.isQuizDone = true;
    let result = 0;
    for(let k = 0; k < this.problemSet.length; k++){
      if(this.problemSet[k].isCorrect){
        result++;
      }
      if(k == (this.problemSet.length - 1)){
        result = result / this.problemSet.length;
      }      
    }
    this.quizScore = result * 100;
  }
}
