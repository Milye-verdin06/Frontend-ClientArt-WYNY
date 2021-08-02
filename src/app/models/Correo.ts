export interface correoRespons {
  status: boolean;
  message: string;
  data: ReqCorreo[];
}

export interface ReqCorreo {
  to: string;
  subject: string;
  message: string;
  cc: string;
}
