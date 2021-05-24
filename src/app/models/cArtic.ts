export interface articuloCRespons {
  status: boolean;
  message: string;
  data: ReqcArtic[];
}
export interface ReqcArtic {
  ar_artic: string;
  ar_desce: string;
  ar_desci: string;
  ar_descf: string;
  ar_desct: string;
  ar_desco: string;
  ar_unid: string;
  ar_pies: number;
  ar_tpiel: string;
  ar_fami: number;
  ar_web: string;
  ar_subp: string;
  ar_obso: string;
  codigoTarifa: string;
}
