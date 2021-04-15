export interface ListaArticulos {
    status:  boolean;
    message: string;
    data:    articulos[];
}

export interface articulos {
    ta_codi:      string;
    ta_clta:      number;
    ta_artic:     string;
    ta_gruix:     number;
    ta_acaba:     string;
    ta_color:     number;
    ta_clas:      string;
    ta_unifa:     string;
    ta_divis:     number;
    ta_tarif_001: number;
    ta_tarif_002: number;
    ta_tarif_003: number;
    ta_tarif_004: number;
    ta_listar:    string;
    ef_clta:      number;
    ef_gruix:     number;
    ef_color:     number;
    ef_divis:     number;
}





/* export class Articulo{
            _id?: number;
            ta_codi: string;
            ta_clta: number;
            ta_artic: string;
            ta_gruix: number;
            ta_acaba: string;
            ta_color: number;
            ta_clas: string;
            ta_unifa:string;
            ta_divis: number;
            ta_tarif_001: number;
            ta_tarif_002: number;
            ta_tarif_003: number;
            ta_tarif_004: number;
            ta_listar: string;
            ef_clta :number;
            ef_gruix: number;
            ef_color: number;
            ef_divis: number;


    constructor (ta_codi: string, ta_clta: number, ta_artic: string, ta_gruix: number, ta_acaba: string,ta_color: number,ta_clas: string,ta_unifa:string, ta_divis: number,
        ta_tarif_001: number,  ta_tarif_002: number, ta_tarif_003: number, ta_tarif_004: number, ta_listar: string,ef_clta :number,ef_gruix: number, ef_color: number, ef_divis: number )
        
        
        {
        this.ta_codi = ta_codi;
        this. ta_clta =  ta_clta;
        this.ta_artic = ta_artic;
        this.ta_gruix = ta_gruix;
        this.ta_acaba = ta_acaba;
        this. ta_color =  ta_color;
        this.ta_clas = ta_clas;
        this.ta_unifa = ta_unifa;
        this.ta_divis= ta_divis;
        this.ta_tarif_001 = ta_tarif_001;
        this.ta_tarif_002 = ta_tarif_002;
        this.ta_tarif_003 = ta_tarif_003;
        this.ta_tarif_004 = ta_tarif_004;
        this.ta_listar = ta_listar;
        this.ef_clta = ef_clta;
        this.ef_gruix = ef_gruix;
        this.ef_color = ef_color;
        this.ef_divis = ef_divis;
        
    }


}

 */