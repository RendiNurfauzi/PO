import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { db, doc, updateDoc } from './firebase/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);

            // Update firstLogin to false
            await updateDoc(userRef, {
                firstLogin: 'false'
            });

            // Handle button click to redirect to main.html
            document.getElementById('continueButton').addEventListener('click', () => {
                window.location.href = 'main.html';
            });
        }
    });
});