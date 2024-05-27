import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { db, getDoc, doc } from './firebase/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            console.log(userData); // Menampilkan semua data pengguna ke konsol

            localStorage.setItem('username', userData.username);
            localStorage.setItem('role', userData.role);

            const nama = localStorage.getItem('username');
            const role = localStorage.getItem('role');
            console.log(nama);
            console.log(role);

            // Membaca field anggota dan mengarahkan pengguna ke halaman yang sesuai
            if (userData.anggota === 'true' && userData.firstLogin === 'true') {
                window.location.href = 'firstlogin.html'; // Arahkan ke firstlogin.html jika ini adalah login pertama dan pengguna adalah anggota
            } else if (userData.anggota === 'true') {
                window.location.href = 'main.html';
            } else if (userData.anggota === 'pendaftar') {
                window.location.href = 'pendaftaranPage.html';
            } else if (userData.anggota === 'terdaftar') {
                window.location.href = 'pending.html';
            } else if (userData.anggota === 'tertolak') {
                window.location.href = 'pendingTertolak.html'; // Jika status anggota adalah 'tertolak', arahkan ke 'pendingTertolak.html'
            } 
        }
    });
});
