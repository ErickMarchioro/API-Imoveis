import Response from '../models/Response.js';
import firebaseApp from './firebaseApp.js';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword  } from "firebase/auth";

import { SignJWT, jwtVerify } from "jose"
import { segredoDoJWT } from './segredos.js';


export function loginUsuarioComEmailSenha(email, password) {
    return new Promise( (resolve, reject)=>{
        const auth = getAuth(firebaseApp); 
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            resolve(userCredential);
          })
          .catch((error) => {
            reject(error);
          });
    });
}


export function criarUsuarioComEmailSenha(email, password) {
    return new Promise( (resolve, reject)=>{
        const auth = getAuth(firebaseApp); 
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            resolve(userCredential);
          })
          .catch((error) => {
            reject(error);
          });
    });
}


export function ApiKeyTest(key) {
        return (key == 'Homem_de_Ferro');
    }

export function createOKResponse(payload) {
    return new Response(200,payload,'OK');
}

export function createUnAuthResponse() {
    return new Response(401,undefined,'Não Autorizado'); 
}

export function createCreatedResponse() {
    return new Response(201,undefined,'Criado com sucesso');
}

export function createUnprocessableReponse(msg) {
    return new Response(422,undefined,msg);
}

export function createNotFoundResponse(msg) {
    return new Response(404, undefined, msg || 'Recurso não encontrado.');
}


export function criaJWT(payload) {
  return new Promise((resolve, reject)=>{
    new SignJWT(payload)
    .setIssuedAt()
    .setSubject('login de usuário da nossa API')
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('2h')
    .sign(segredoDoJWT)
    .then((jwt)=> resolve(jwt))
    .catch((error)=>reject(error));
  });
}


export function validaJWT(jwt) {
  return new Promise((resolve, reject)=>{
    jwtVerify(jwt, segredoDoJWT)
    .then((obj)=>{
      resolve(obj.payload);
    })
    .catch((error)=> reject(error));
  });
}