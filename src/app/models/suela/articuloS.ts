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

export interface PlanchadoRespons {
  status: boolean;
  message: string;
  data: ReqPlanchado[];
}

export interface ReqPlanchado {
  linea: string;
  descripcionLinea: string;
  codigo: string;
  descripcion: string;
}

export interface TipoGrosorRespons {
  status: boolean;
  message: string;
  data: ReqTipoGrosor[];
}

export interface ReqTipoGrosor {
  tg_tipo: string;
  tg_nombre: string;
}
export interface GrosorRespons {
  status: boolean;
  message: string;
  data: ReqGrosor[];
}

export interface ReqGrosor {
  gr_codi: string;
  gr_desce: string;
}

export interface CombinacionRespons {
  status: boolean;
  message: string;
  data: ReqCombinacion[];
}

export interface ReqCombinacion {
  linea: string;
  descripcionLinea: string;
  codigo: string;
  descripcion: string;
}

export interface ColorTenidoRespons {
  status: boolean;
  message: string;
  data: ReqColorTenido[];
}

export interface ReqColorTenido {
  linea: string;
  descripcionLinea: string;
  codigo: string;
  descripcion: string;
}
