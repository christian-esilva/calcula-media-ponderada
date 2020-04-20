import { DecimalPipe } from '@angular/common';

export class Aluno {
  constructor(
    public id: number,
    public nome: string,
    public notaProva1: number,
    public notaProva2: number,
    public notaMinima: number
  ) {}
}
