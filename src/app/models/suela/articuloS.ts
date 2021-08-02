export interface LineaRespons {
  status: boolean;
  message: string;
  data: ReqLineas[];
}

export interface ReqLineas {
  tp_codi: string;
  tp_desc: string;
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
