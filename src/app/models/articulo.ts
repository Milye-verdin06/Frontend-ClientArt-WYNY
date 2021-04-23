export interface articuloRespons {
  status: boolean;
  message: string;
  data: ReqArticulos[];
}

export interface ReqArticulos {
  ta_codi: string;
  ta_clta: number;
  ta_artic: string;
  ta_gruix: number;
  ta_acaba: string;
  ta_color: number;
  ta_clas: string;
  ta_unifa: string;
  ta_divis: number;
  ta_tarif_001: number;
  ta_tarif_002: number;
  ta_tarif_003: number;
  ta_tarif_004: number;
  ta_listar: string;
  ef_clta: number;
  ef_gruix: number;
  ef_color: number;
  ef_divis: number;
  ar_tpiel: string;
  ar_codigo: string;
  ar_descripcion: string;
}

export interface LineaRespons {
  status: boolean;
  message: string;
  data: ReqLineas[];
}

export interface ReqLineas {
  tp_codi: string;
  tp_desc: string;
}
