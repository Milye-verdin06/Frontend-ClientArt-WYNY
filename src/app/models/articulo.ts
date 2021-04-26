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

export interface FormatoRespons {
  status: boolean;
  message: string;
  data: ReqFormatos[];
}

export interface ReqFormatos {
  ft_tpiel: string;
  ft_codi: string;
  ft_desc: string;
  ft_desci: string;
  ft_sts: FtStsFormatos;
}

export enum FtStsFormatos {
  A = 'A',
}

export interface TamanoRespons {
  status: boolean;
  message: string;
  data: ReqTamanos[];
}

export interface ReqTamanos {
  tm_tpiel: TmTpielFormatos;
  tm_codi: string;
  tm_desc: string;
  tm_sts: TmStsFormatos;
}

export enum TmStsFormatos {
  A = 'A',
  B = 'B',
}

export enum TmTpielFormatos {
  Az = 'AZ',
  CS = 'CS',
  Co = 'CO',
  Si = 'SI',
}

export interface GrosorRespons {
  status: boolean;
  message: string;
  data: ReqGrosores[];
}

export interface ReqGrosores {
  gl_linea: string;
  gl_codi: string;
  gl_desc: string;
}

export interface ColorRespons {
  status: boolean;
  message: string;
  data: ReqColores[];
}

export interface ReqColores {
  co_codi: string;
  co_desce: string;
}
