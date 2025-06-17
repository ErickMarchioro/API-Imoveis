import { criarUsuarioComEmailSenha,
         loginUsuarioComEmailSenha,
        criaJWT } from "../services/index.js";
import { createOKResponse, createUnAuthResponse, createUnprocessableReponse } from "../services/index.js"; // Importar funções de resposta

const usersController = {
  
    criaLoginFirebase(email, senha) {
        return new Promise((resolve, reject)=> {
            criarUsuarioComEmailSenha(email, senha)
            .then(
                (credencial) => {
                    let payload = {
                        uid: credencial.user.uid, 
                        email: credencial.user.email,
                        nivel: '3' 
                    };
                    criaJWT(payload)
                    .then((jwt) => resolve(createOKResponse({ jwt })))
                    .catch((erro) => reject(createUnprocessableReponse(erro.message)));
                }
            )
            .catch(
                (erro) => {
                    // Tratamento de erros específicos do Firebase Auth
                    let message = "Erro ao criar usuário.";
                    if (erro.code === 'auth/email-already-in-use') {
                        message = "Este e-mail já está em uso.";
                    } else if (erro.code === 'auth/weak-password') {
                        message = "A senha deve ter pelo menos 6 caracteres.";
                    } else if (erro.code === 'auth/invalid-email') {
                        message = "Formato de e-mail inválido.";
                    }
                    reject(createUnprocessableReponse(message)); 
                }
            );
        });
    },

    loginFirebase(email, senha) {
        return new Promise((resolve, reject)=> {
            loginUsuarioComEmailSenha(email, senha)
            .then(
                (credencial) => {
                    let payload = {
                        uid : credencial.user.uid, 
                        email: credencial.user.email,
                        nivel: 3
                    };
                    criaJWT(payload)
                    .then((jwt) => resolve(createOKResponse({ jwt }))) 
                    .catch((erro) => reject(createUnprocessableReponse(erro.message))); 
                }
            )
            .catch(
                (erro) => {
                    // Tratamento de erros específicos do Firebase Auth
                    let message = "Erro ao fazer login.";
                    if (erro.code === 'auth/user-not-found' || erro.code === 'auth/wrong-password') {
                        message = "E-mail ou senha inválidos.";
                    } else if (erro.code === 'auth/invalid-email') {
                        message = "Formato de e-mail inválido.";
                    }
                    reject(createUnAuthResponse(message));
                }
            );
        });
    }
};

export default usersController;