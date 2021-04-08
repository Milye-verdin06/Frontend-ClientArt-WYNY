import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
 console.log('http interceptor');

 req = req.clone({
     setHeaders: { 'Authorization': 'Rul_XooomLCxo0OrNcvMNP7EnrKtsTDLiWt-AGRA-sW45Ybb5Fg3KCgOpT-jHf3lmWsnBcBSSidz88nGsx2ulEHTqjobtl7cglGWb_Px2241rPH0BnwcyXefZ92GM9hrOtmgGOW8Tq_9fKJoNFzzYghTyKwrEsXj9PHJ5yvtXiStzf9Mwa_QpBzcoIoftPRJGgFbLN_UO2wb3Fq5j-IsJ66poc1GRmnePNuRO2hVflK7RyIx7mhYVF2dQJCTf6qft9HYWCsyX1wjPATroyG4ghvabBLlJ0zyAW3zYw4ps0fbku_gK_pc0K3thQocTuPC_yvNOo0WL8k_SPYIwrKpLg'}
 });
 return next.handle(req);


}

}