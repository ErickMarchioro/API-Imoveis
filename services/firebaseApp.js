import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBr_YrwmLPBqSg62f7bskjxQGO643v64TI",
  authDomain: "api-imoveis-4b57b.firebaseapp.com",
  projectId: "api-imoveis-4b57b",
  storageBucket: "api-imoveis-4b57b.firebasestorage.app",
  messagingSenderId: "10697382031",
  appId: "1:10697382031:web:cbb71b7e7591f8901e38fa",
  measurementId: "G-ZFFF3PTPJH"
};
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;