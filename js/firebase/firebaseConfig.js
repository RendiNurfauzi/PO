// Import SDK Firebase yang diperlukan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc,deleteDoc  } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js"; // Import getAuth
// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDIfFuQd7wTixhhnZw4CihG-rOaL5fCIsE",
    authDomain: "azozing-organisasi.firebaseapp.com",
    projectId: "azozing-organisasi",
    storageBucket: "azozing-organisasi.appspot.com",
    messagingSenderId: "865618176927",
    appId: "1:865618176927:web:7f90e6214dad632b0fabaa",
    measurementId: "G-12EYF3XB82"
};

// Inisialisasi Firebase
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const storage = getStorage(app);

// Ekspor Firestore
// Ekspor modul Firebase yang diperlukan
export { db, auth, storage, doc, updateDoc, getDoc, ref, uploadBytes, getDownloadURL,deleteDoc };
