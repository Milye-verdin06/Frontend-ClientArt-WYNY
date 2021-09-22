import { Component, OnInit } from '@angular/core';
import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agregar-articulosTiras',
  templateUrl: './agregar-articulos tiras.component.html',
})
export class AgregarArticulosTirasComponent implements OnInit {
  public nombreVendedor: string = '';
  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;
  divisaSelecc: any;
  nomDivisa: any;
  unidadNSelecc: any;

  constructor(private aprobationService: AprobationService) {}
  ngOnInit() {
    this.nombreVendedor = environment.nom;

    this._servicetoVar();
  }

  private _servicetoVar() {
    this.aprobationService.getCodCliente().subscribe((d) => {
      this.codCliente = d;
    });
    this.aprobationService.getNombreCliente().subscribe((d) => {
      this.nomCliente = d;
    });
    this.aprobationService.getUnidadMedida().subscribe((d) => {
      this.unidadSelecc = d;
    });

    this.aprobationService.getDivisa().subscribe((d) => {
      this.divisaSelecc = d;
    });

    this.aprobationService.getNombreDivisa().subscribe((d) => {
      this.nomDivisa = d;
    });

    this.aprobationService.getUnidadN().subscribe((d) => {
      this.unidadNSelecc = d;
    });
  }
}
