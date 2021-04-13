import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-especificaciones',
  templateUrl: './especificaciones.component.html',

})
export class EspecificacionesComponent implements OnInit {

  constructor( private modalService: NgbModal,) { }
  

  ngOnInit(): void {
   
    
  }
  open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {
         
       }, (reason) => {
          
});

   
    
  }

 

}

