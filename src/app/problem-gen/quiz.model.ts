import { Problem } from "./problem.model";

export class Quiz{
  numberOfProblems: number;
  index: number = 0;
  quizScore: number;
  problemSet: Problem[] = Array<Problem>(5);  
  currentProblem: Problem;
  problemResponse: string[] = ["Wrong my friend.", "Right on the money!"]
  currentMessage: string;
  isQuizDone: boolean = false;


}