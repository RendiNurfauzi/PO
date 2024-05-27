import { db, auth, getDoc, doc, updateDoc } from './firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const pendaftaranList = document.getElementById('pendaftaranList');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');
    const acceptButton = document.getElementById('acceptButton');
    const rejectButton = document.getElementById('rejectButton');

    let currentUserRole;
    let selectedUserId;

    // Check user role
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            currentUserRole = userDoc.data().role;
        }
    });

    closePopup.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    const q = query(collection(db, 'users'), where('anggota', '==', 'terdaftar'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const pendaftaranDiv = document.createElement('div');
        pendaftaranDiv.className = 'pendaftaran';

        // Dapatkan URL foto profil dari Firebase Storage
        const storage = getStorage();
        const profileImageRef = ref(storage, `profileImages/${doc.id}/profil.png`);
        const profileImageUrl = await getDownloadURL(profileImageRef);

        pendaftaranDiv.innerHTML = `
        <img src="${profileImageUrl}" alt="Foto Profil">
        <h2>${data.nama}</h2>
        <p>Email: ${data.email}</p> <!-- Tambahkan baris ini untuk menampilkan email -->
        <p>NPM: ${data.npm}</p>
        <p>Angkatan: ${data.angkatan}</p>
        <p>Jurusan: ${data.jurusan}</p>
        <p>Jabatan: ${data.jabatan}</p>
        <p>Divisi: ${data.divisi}</p>
        <p>Visi: ${data.visi}</p> <!-- Tambahkan baris ini untuk menampilkan visi -->
        <p>Misi: ${data.misi}</p> <!-- Tambahkan baris ini untuk menampilkan misi -->
        <p>Alasan: ${data.alasan}</p> <!-- Tambahkan baris ini untuk menampilkan alasan -->
    `;

    pendaftaranDiv.addEventListener('click', () => {
        if (currentUserRole === 'admin') {
            selectedUserId = doc.id;
            popupContent.innerHTML = `
                <img src="${profileImageUrl}" alt="Foto Profil">
                <label for="nama">Nama:</label>
                <input type="text" id="nama" value="${data.nama}" disabled>
                <label for="email">Email:</label>
                <input type="text" id="email" value="${data.email}" disabled>
                <label for="npm">NPM:</label>
                <input type="text" id="npm" value="${data.npm}" disabled>
                <label for="angkatan">Angkatan:</label>
                <input type="text" id="angkatan" value="${data.angkatan}" disabled>
                <label for="jurusan">Jurusan:</label>
                <input type="text" id="jurusan" value="${data.jurusan}" disabled>
                <label for="jabatan">Jabatan:</label>
                <input type="text" id="jabatan" value="${data.jabatan}" disabled>
                <label for="divisi">Divisi:</label>
                <input type="text" id="divisi" value="${data.divisi}" disabled>
                <label for="visi">Visi:</label>
                <input type="text" id="visi" value="${data.visi}" disabled>
                <label for="misi">Misi:</label>
                <input type="text" id="misi" value="${data.misi}" disabled>
                <label for="alasan">Alasan:</label>
                <input type="text" id="alasan" value="${data.alasan}" disabled>
            `;
            popup.classList.add('active');
        }
    });

        pendaftaranList.appendChild(pendaftaranDiv);
    });

    acceptButton.addEventListener('click', async () => {
        await updateDoc(doc(db, 'users', selectedUserId), {
            anggota: 'true'
        });

        popup.classList.remove('active');
        window.location.reload(); // Refresh halaman untuk menampilkan perubahan
    });

    rejectButton.addEventListener('click', async () => {
        await updateDoc(doc(db, 'users', selectedUserId), {
            anggota: 'ditolak'
        });

        popup.classList.remove('active');
        window.location.reload(); // Refresh halaman untuk menampilkan perubahan
    });
});
