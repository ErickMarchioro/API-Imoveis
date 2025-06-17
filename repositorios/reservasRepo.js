import firestoreServices from '../services/firestore.js';
import Reserva from '../models/Reserva.js';

const COLLECTION_NAME = 'reservas';

const reservasRepo = {
    async addReserva(reserva) {
        const dataToSave = { ...reserva };
        if (dataToSave.id === 0 || dataToSave.id === null || dataToSave.id === undefined) {
            delete dataToSave.id;
        }
        return await firestoreServices.addDocument(COLLECTION_NAME, dataToSave);
    },

    async getReservaById(id) {
        const data = await firestoreServices.getDocumentById(COLLECTION_NAME, id);
        return data ? Reserva.build(data) : null;
    },

    async getAllReservas(filters = {}) {
        const firestoreFilters = [];
        if (filters.idImovel) {
            firestoreFilters.push({ field: 'idImovel', operator: '==', value: filters.idImovel });
        }
        if (filters.idUsuario) {
            firestoreFilters.push({ field: 'idUsuario', operator: '==', value: filters.idUsuario });
        }
        const data = await firestoreServices.getAllDocuments(COLLECTION_NAME, firestoreFilters);
        return data.map(item => Reserva.build(item));
    },

    async updateReserva(id, updates) {
        await firestoreServices.updateDocument(COLLECTION_NAME, id, updates);
    },

    async deleteReserva(id) {
        await firestoreServices.deleteDocument(COLLECTION_NAME, id);
    }
};

export default reservasRepo;