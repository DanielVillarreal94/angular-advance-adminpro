import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  labels1: string[] = ['Arroz', 'Pan', 'Sal'];
  data1 = [[400,200,20]];

}
