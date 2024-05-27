import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { auth } from './firebase/firebaseConfig.js'; // Pastikan jalur ini benar

// Fungsi untuk melakukan logout
const performLogout = () => {
    signOut(auth).then(() => {
        console.log('Logout berhasil');
        window.location.href = 'LoginPage.html'; // Redirect ke halaman login setelah logout
    }).catch((error) => {
        console.error('Error saat logout:', error);
        alert('Gagal logout: ' + error.message);
    });
};

// Jalankan fungsi logout saat dokumen dimuat
document.addEventListener('DOMContentLoaded', () => {
    performLogout();
});