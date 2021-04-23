import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFilter',
})
export class PipeFilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (arg === '' || arg.length < 3) return value;
    const resultadoArticulo = [];
    for (const articulo of value) {
      if (
        articulo.ar_descripcion.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultadoArticulo.push(articulo);
      }
    }
    return resultadoArticulo;
  }
}
