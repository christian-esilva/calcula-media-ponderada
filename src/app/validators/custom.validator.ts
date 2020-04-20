import { AbstractControl, Validators } from '@angular/forms';

export class CustomValidator {
    constructor() { }

    static valorValidoNota() {
        return (control: AbstractControl): Validators => {
            const valor = control.value;
            if (valor < 0 || valor > 10) {
                return { 'A nota precisa ser entre 0 e 10': true };
            }
        };
    }
}
