import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Aluno } from 'src/app/models/aluno.model';
import { CustomValidator } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Exercício 7';
  numRegex = /^-?\d*[,]?\d{0,1}$/;
  notaMinima = 0.0;

  public alunos: Aluno[] = [];
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    // Validação dos campos do formulário
    this.form = this.fb.group({
      nome: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(80),
        Validators.required
      ])],
      prova1: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.numRegex),
        CustomValidator.valorValidoNota()
      ])],
      prova2: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.numRegex),
        CustomValidator.valorValidoNota()
      ])]
    });

    // Carrega a lista de alunos do sessionStorage
    this.carregarAlunos();
  }

  submit() {
    // Obter os valores do formulário para criar o objeto aluno
    const nome = this.form.controls['nome'].value;
    const prova1 = this.form.controls['prova1'].value.replace(',', '.');
    const prova2 = this.form.controls['prova2'].value.replace(',', '.');
    const id = this.alunos.length + 1;
    const notaMinima = this.calculaNotaMinima(prova1, prova2);

    // Cria uma nova instancia de alunos e adiciona na lista
    const aluno = new Aluno(id, nome, prova1, prova2, Number(notaMinima));
    this.alunos.push(aluno);

    // Salva no sessionStorage do browser
    this.salvar();
  }

  salvar() {
    // Converte a lista de alunos em json para uma string e depois salva no sessionStorage do browser
    const dados = JSON.stringify(this.alunos);
    sessionStorage.setItem('alunos', dados);
  }

  calculaNotaMinima(nota1: number, nota2: number) {
    this.notaMinima = 0.0;
    let mediaAtual = ((nota1 * 0.25) + (nota2 * 0.25) + (this.notaMinima * 0.5)) / 1.0;

    // Enquanto a média atual for menor que 6.2 adicionar mais 0,1 na nota minima até que a media atual seja maior ou igual a 6,2
    while (mediaAtual < 6.2) {
      // Incrementa mais 0,1 na nota minima e calcular novamente a média para verificar se atinge 6,2
      this.notaMinima += 0.1;
      mediaAtual = ((nota1 * 0.25) + (nota2 * 0.25) + (this.notaMinima * 0.5)) / 1.0;
    }

    return this.notaMinima.toPrecision(2);
  }

  excluir(aluno: Aluno) {
    // Recupera o indice do aluno para ser excluído
    const index = this.alunos.indexOf(aluno);
    if (index !== -1) {
      // Exclui o aluno através da função splice pelo indice
      this.alunos.splice(index, 1);
    }
    // Atualiza o sessionStorage
    this.salvar();
  }

  carregarAlunos() {
    // Recuperando a lista de alunos do sessionStorage quando a aplicação for iniciada
    const dados = sessionStorage.getItem('alunos');
    if (dados) {
      this.alunos = JSON.parse(dados);
    } else {
      this.alunos = [];
    }
  }
}
