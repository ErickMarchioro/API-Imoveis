import firebaseApp from "./firebaseApp.js";
import { getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query,
    where
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

const firestoreServices = {
    async addDocument(collectionName, data, id = null) {
        try {
            const colRef = collection(db, collectionName);
            let docRef;
            if (id) {
                docRef = doc(colRef, id);
                await setDoc(docRef, data);
            } else {
                docRef = await addDoc(colRef, data);
            }
            return docRef.id;
        } catch (error) {
            console.error(`Erro ao adicionar documento na coleção ${collectionName}:`, error);
            throw error;
        }
    },

    async getDocumentById(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Erro ao buscar documento ${id} na coleção ${collectionName}:`, error);
            throw error;
        }
    },

    async getAllDocuments(collectionName, filters = []) {
        try {
            const colRef = collection(db, collectionName);
            let q = query(colRef);

            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            const querySnapshot = await getDocs(q);
            const result = [];
            querySnapshot.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });
            return result;
        } catch (error) {
            console.error(`Erro ao buscar documentos na coleção ${collectionName}:`, error);
            throw error;
        }
    },

    async updateDocument(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error(`Erro ao atualizar documento ${id} na coleção ${collectionName}:`, error);
            throw error;
        }
    },

    async deleteDocument(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Erro ao deletar documento ${id} na coleção ${collectionName}:`, error);
            throw error;
        }
    }
};

export default firestoreServices;