export interface clientRespons {
    status:  boolean;
    message: string;
    data:    listaCliente[];
}

 export interface listaCliente {
    c_nom:  string;
    c_codi: string;
}