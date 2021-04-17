export class Problem{
    firstDigit: number = 0;
    secondDigit: number = 0;
    answer: number = 0;
    possibleAnswers: Answer[] = Array<Answer>(4);
    isAnswered: boolean = false;
    isCorrect: boolean = false;


}

export class Answer{
    value: number;
    constructor(v: number){
        this.value = v;
    }
}