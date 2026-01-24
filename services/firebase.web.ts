import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGUMiBJv7tvZWo6N7xP7fSlRWo0PKiinI",
  authDomain: "decentralized-todo-auth.firebaseapp.com",
  projectId: "decentralized-todo-auth",
  storageBucket: "decentralized-todo-auth.firebasestorage.app",
  messagingSenderId: "694394836750",
  appId: "1:694394836750:web:c2ec0cbcdc7a6ec9b6a95f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

