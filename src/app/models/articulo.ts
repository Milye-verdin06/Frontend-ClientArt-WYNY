export class articulo{
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
            //"ef_clta": 0,
           // "ef_gruix": 0, //el servicio de getAll articulos me arroja estos parametros y no van aqui por que son de la especificacion
           // "ef_color": 0,
           // "ef_divis": 0


    constructor (ta_codi: string, ta_codCliente: number, ta_codArticulo: string, ta_grosor: number, ta_acabado: string,ta_color: number,ta_clasificado: string,ta_uniMedida:string, ta_divisa: number,
        ta_tarif_001: number,  ta_tarif_002: number, ta_tarif_003: number, ta_tarif_004: number, ta_listar: string )
        
        
        {
        this.ta_codi = ta_codi;
        this. ta_clta =  ta_codCliente;
        this.ta_artic = ta_codArticulo;
        this.ta_gruix = ta_grosor;
        this.ta_acaba = ta_acabado;
        this. ta_color =  ta_color;
        this.ta_clas = ta_clasificado;
        this.ta_unifa = ta_uniMedida;
        this.ta_divis= ta_divisa;
        this.ta_tarif_001 = ta_tarif_001;
        this.ta_tarif_002 = ta_tarif_002;
        this.ta_tarif_003 = ta_tarif_003;
        this.ta_tarif_004 = ta_tarif_004;
        this.ta_listar= ta_listar;
        
    }


}

