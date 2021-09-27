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
  codigoTarifa: string;
}

export interface LineaRespons {
  status: boolean;
  message: string;
  data: ReqLineas[];
}

export interface ReqLineas {
  tp_codi: string;
  tp_desc: string;
  tp_unidad: string;
  un_unidad: string;
  un_nombre: string;
  tp_vl_un: string;
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
  ft_sts: string;
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
  tm_tpiel: string;
  tm_codi: string;
  tm_desc: string;
  tm_sts: string;
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
  cl_codi: string;
  cl_desc: string;
  cl_linea: string;
}

export interface ColorACRespons {
  status: boolean;
  message: string;
  data: ReqColoresAC[];
}

export interface ReqColoresAC {
  co_codi: string;
  co_desce: string;
}

export interface AcabadosRespons {
  status: boolean;
  message: string;
  data: ReqAcabados[];
}

export interface ReqAcabados {
  ac_codi: string;
  ac_desce: string;
}

export interface ArticuloExisteTarifa {
  status: boolean;
  message: string;
  data: ReqArticulosExistentes[];
}

//validar que ya existe en c_tarifa
export interface ReqArticulosExistentes {
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
}

export interface TamborRespons {
  status: boolean;
  message: string;
  data: ReqTambor[];
}

export interface ReqTambor {
  tl_codi: string;
  tl_desc: string;
  tl_linea: string;
  tl_sts: string;
  tl_desCorta: string;
}

export interface SeleccionRespons {
  status: boolean;
  message: string;
  data: ReqSeleccion[];
}

export interface ReqSeleccion {
  sl_codi: string;
  sl_desc: string;
  sl_linea: string;
}
