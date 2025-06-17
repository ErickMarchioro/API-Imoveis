import imoveisRepo from '../repositorios/imoveisRepo.js';
import Imovel from '../models/Imovel.js';
import { createOKResponse, createCreatedResponse, createUnprocessableReponse, createUnAuthResponse } from '../services/index.js';

const imoveisController = {
   
    async addImovel(imovelData, idProprietario) {
        try {
            if (!imovelData.titulo || !imovelData.endereco || !idProprietario) {
                return createUnprocessableReponse('Dados mínimos (título, endereço, idProprietario) do imóvel são obrigatórios.');
            }

            
            const newImovel = new Imovel(
                null,
                imovelData.titulo,
                imovelData.descricao,
                imovelData.endereco,
                imovelData.cidade,
                imovelData.estado,
                imovelData.cep,
                imovelData.tipo,
                imovelData.quartos,
                imovelData.banheiros,
                imovelData.precoPorNoite,
                true, // Imóvel recém-criado é sempre disponível
                idProprietario,
                imovelData.imageUrls || []
            );

            const id = await imoveisRepo.addImovel(newImovel);
            return createCreatedResponse({ id, message: 'Imóvel cadastrado com sucesso.' });
        } catch (error) {
            console.error('Erro ao adicionar imóvel:', error);
            return createUnprocessableReponse(error.message);
        }
    },

    async getImovelById(id) {
        try {
            const imovel = await imoveisRepo.getImovelById(id);
            if (!imovel) {
                return createUnprocessableReponse('Imóvel não encontrado.');
            }
            return createOKResponse(imovel);
        } catch (error) {
            console.error('Erro ao buscar imóvel por ID:', error);
            return createUnprocessableReponse(error.message);
        }
    },

    async getAllImoveis(idProprietario = null) {
        try {
            let imoveis;
            if (idProprietario) {
                imoveis = await imoveisRepo.getImoveisByProprietario(idProprietario);
            } else {
                imoveis = await imoveisRepo.getAllImoveis();
            }
            return createOKResponse(imoveis);
        } catch (error) {
            console.error('Erro ao buscar todos os imóveis:', error);
            return createUnprocessableReponse(error.message);
        }
    },

    async updateImovel(id, updates, idProprietario) {
        try {
            const imovelExistente = await imoveisRepo.getImovelById(id);
            if (!imovelExistente) {
                return createUnprocessableReponse('Imóvel não encontrado para atualização.');
            }
            // Verifica se o usuário logado é o proprietário do imóvel
            if (imovelExistente.idProprietario !== idProprietario) {
                return createUnAuthResponse('Você não tem permissão para atualizar este imóvel.');
            }

            await imoveisRepo.updateImovel(id, updates);
            return createOKResponse({ message: 'Imóvel atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar imóvel:', error);
            return createUnprocessableReponse(error.message);
        }
    },

    async deleteImovel(id, idProprietario) {
        try {
            const imovelExistente = await imoveisRepo.getImovelById(id);
            if (!imovelExistente) {
                return createUnprocessableReponse('Imóvel não encontrado para exclusão.');
            }
            // Verifica se o usuário logado é o proprietário do imóvel
            if (imovelExistente.idProprietario !== idProprietario) {
                return createUnAuthResponse('Você não tem permissão para deletar este imóvel.');
            }

            await imoveisRepo.deleteImovel(id);
            return createOKResponse({ message: 'Imóvel deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar imóvel:', error);
            return createUnprocessableReponse(error.message);
        }
    }
};

export default imoveisController;