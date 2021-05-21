export interface Usuario {
  username: string;
  password: string;
  clv: string;
  usr: string;
  fds: string;
  nom: string;
}

export interface UsuarioRespons {
  access_token: string;
  token_type: string;
  expires_in: number;
}
