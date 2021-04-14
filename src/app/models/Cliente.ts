export interface clientRespons {
    status:  boolean;
    message: string;
    data:    listaCliente[];
}

 interface listaCliente {
    c_nom:  string;
    c_codi: string;
}