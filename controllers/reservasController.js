import reservasRepo from '../repositorios/reservasRepo.js';
import imoveisRepo from '../repositorios/imoveisRepo.js';
import Reserva from '../models/Reserva.js';
import { createOKResponse, createCreatedResponse, createUnprocessableReponse, createUnAuthResponse, createNotFoundResponse } from '../services/index.js';

const reservasController = {
    async addReserva(reservaData, idUsuario) {
        try {
            // Validações básicas
            if (!reservaData.idImovel || !reservaData.dataInicio || !reservaData.dataFim || !reservaData.numeroHospedes) {
                return createUnprocessableReponse('Dados mínimos (idImovel, dataInicio, dataFim, numeroHospedes) da reserva são obrigatórios.');
            }

            // Verifica se o imóvel existe
            const imovel = await imoveisRepo.getImovelById(reservaData.idImovel);
            if (!imovel) {
                return createUnprocessableReponse('Imóvel não encontrado para reserva.');
            }
            // Verifica a disponibilidade geral do imóvel (campo 'disponivel')
            if (!imovel.disponivel) {
                return createUnprocessableReponse('Imóvel não está disponível para reserva.');
            }

            // Validação de datas
            const dataInicio = new Date(reservaData.dataInicio);
            const dataFim = new Date(reservaData.dataFim);
            if (dataInicio >= dataFim) {
                return createUnprocessableReponse('A data de fim deve ser posterior à data de início.');
            }

            
            const valorTotal = reservaData.valorTotal || 0;

            const newReserva = new Reserva(
                null, 
                reservaData.idImovel,
                idUsuario, 
                dataInicio.toISOString(), 
                dataFim.toISOString(),
                valorTotal,
                'pendente', // Status inicial padrão
                reservaData.numeroHospedes
            );

            const reservaCriada = await reservasRepo.addReserva(newReserva);
            return createCreatedResponse(reservaCriada);

        } catch (error) {
            console.error('Erro ao adicionar reserva:', error);
            return createUnprocessableReponse('Erro interno ao adicionar reserva: ' + error.message);
        }
    },

    async getReservaById(id) {
        try {
            const reserva = await reservasRepo.getReservaById(id);
            if (!reserva) {
                return createNotFoundResponse('Reserva não encontrada.');
            }
            return createOKResponse(reserva);
        } catch (error) {
            console.error('Erro ao buscar reserva por ID:', error);
            return createUnprocessableReponse('Erro interno ao buscar reserva.');
        }
    },

    async getAllReservas() {
        try {
            const reservas = await reservasRepo.getAllReservas();
            return createOKResponse(reservas);
        } catch (error) {
            console.error('Erro ao buscar todas as reservas:', error);
            return createUnprocessableReponse('Erro interno ao buscar reservas.');
        }
    },

    async updateReserva(id, updates, idUsuario, userNivel) {
        try {
            const reservaExistente = await reservasRepo.getReservaById(id);
            if (!reservaExistente) {
                return createNotFoundResponse('Reserva não encontrada para atualização.');
            }

            // Somente o usuário que fez a reserva ou um admin pode atualizar
            if (reservaExistente.idUsuario !== idUsuario && userNivel !== 'admin') {
                return createUnAuthResponse('Você não tem permissão para atualizar esta reserva.');
            }

            // Validação de datas se forem atualizadas
            if (updates.dataInicio || updates.dataFim) {
                const novaDataInicio = updates.dataInicio ? new Date(updates.dataInicio) : new Date(reservaExistente.dataInicio);
                const novaDataFim = updates.dataFim ? new Date(updates.dataFim) : new Date(reservaExistente.dataFim);

                if (novaDataInicio >= novaDataFim) {
                    return createUnprocessableReponse('A nova data de fim deve ser posterior à nova data de início.');
                }
                updates.dataInicio = novaDataInicio.toISOString();
                updates.dataFim = novaDataFim.toISOString();
            }

            await reservasRepo.updateReserva(id, updates);
            return createOKResponse({ message: 'Reserva atualizada com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar reserva:', error);
            return createUnprocessableReponse(error.message);
        }
    },

    async deleteReserva(id, idUsuario, userNivel) {
        try {
            const reservaExistente = await reservasRepo.getReservaById(id);
            if (!reservaExistente) {
                return createNotFoundResponse('Reserva não encontrada para exclusão.');
            }

            // Somente o usuário que fez a reserva ou um admin pode deletar
            if (reservaExistente.idUsuario !== idUsuario && userNivel !== 'admin') {
                return createUnAuthResponse('Você não tem permissão para deletar esta reserva.');
            }

            await reservasRepo.deleteReserva(id);
            return createOKResponse({ message: 'Reserva deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar reserva:', error);
            return createUnprocessableReponse(error.message);
        }
    }
};

export default reservasController;