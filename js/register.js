import { db } from './firebase/firebaseConfig.js'; // Import db dari konfigurasi Firebase yang ada
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js"; // Tambahkan ini
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nama = document.getElementById('username').value;
    const npm = document.getElementById('npm').value;
    const email = document.getElementById('email').value; // Pastikan ini ada dan benar
    const password = document.getElementById('password').value;
    const verifyPassword = document.getElementById('verifyPassword').value;


    if (password !== verifyPassword) {
        alert('Password dan Verifikasi Password tidak cocok!');
        return;
    }

    const auth = getAuth();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            nama: nama,
            npm: npm,
            email: email, // Menyimpan email juga di Firestore
            password: password, // Catatan: menyimpan password plaintext sangat tidak disarankan
            role: "none",
            divisi: "none",    
            jabatan: "none",    
            jurusan: "none",
            angkatan: "none",
            anggota : "pendaftar"    
        });
        
        alert('Pendaftaran berhasil!');
    } catch (error) {
        console.error("Error menambahkan dokumen: ", error);
        alert('Pendaftaran gagal!');
    }
});
