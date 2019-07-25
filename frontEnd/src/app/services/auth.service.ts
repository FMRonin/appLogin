import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080';
  //private apikey = 'AIzaSyASKJVwhIbLlDJmihu7_5Zwy7kwQtd7QoU'
  private userToken = '';

  // Crear nuevo usuario : https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]
  // Login : https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  constructor( private http: HttpClient) { }

    logout(){
      localStorage.removeItem('token');
    }

    login( usuario:UsuarioModel ){
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `/api/login`,
      {
        "login":{
          "username":usuario.email,
          "pass":usuario.password
        }
      }
    ).pipe(
      map( resp => {
        this.saveToken(resp['idToken'])
        return resp;
      })
    );
    }



    createUser(usuario:UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
      };

    return this.http.post(
      '/api/signin',
      {
        "user":{
          "userName":usuario.email,
          "name":usuario.nombre,
          "lastName":"",
          "pass":usuario.password
        }
      }
      ).pipe(
        map( resp => {
          console.log(resp['session'].sessionId);
          this.saveToken(resp['session'].sessionId);
          return resp;
        })
      );
    }

    getUser( sessionId:String ){
      const authData = {
        sessionId
      };
  
      return this.http.post(
        `/api/user`,
        authData
      ).pipe(
        map( resp => {
          this.saveToken(resp['user'])
          return resp;
        })
      );
      }

    private saveToken( idToken: string) {
        this.userToken = idToken;
        localStorage.setItem('token', idToken)
    }

    private getToken(){
      if (localStorage.getItem('token')) {
        this.userToken = localStorage.getItem('token')
      }else{
        this.userToken = '';
      }
    }

    isAuthenticate():boolean{
      return this.userToken.length > 2;
    }

}
