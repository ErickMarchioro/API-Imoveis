import firestoreServices from '../services/firestore.js';
import Imovel from '../models/Imovel.js';

const COLLECTION_NAME = 'imoveis';

const imoveisRepo = {

    async addImovel(imovel) {
        const dataToSave = { ...imovel };
        if (dataToSave.id === 0 || dataToSave.id === null || dataToSave.id === undefined) {
            delete dataToSave.id;
        }
        return await firestoreServices.addDocument(COLLECTION_NAME, dataToSave);
    },

    async getImovelById(id) {
        const data = await firestoreServices.getDocumentById(COLLECTION_NAME, id);
        return data ? Imovel.build(data) : null;
    },

    async getAllImoveis() {
        const data = await firestoreServices.getAllDocuments(COLLECTION_NAME);
        return data.map(item => Imovel.build(item));
    },

    async updateImovel(id, updates) {
        await firestoreServices.updateDocument(COLLECTION_NAME, id, updates);
    },

    async deleteImovel(id) {
        await firestoreServices.deleteDocument(COLLECTION_NAME, id);
    },


    async getImoveisByProprietario(idProprietario) {
        const filters = [{ field: 'idProprietario', operator: '==', value: idProprietario }];
        const data = await firestoreServices.getAllDocuments(COLLECTION_NAME, filters);
        return data.map(item => Imovel.build(item));
    }
};

export default imoveisRepo;