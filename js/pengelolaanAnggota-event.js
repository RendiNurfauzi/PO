import { db, auth, getDoc, doc, updateDoc, deleteDoc } from './firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const anggotaList = document.getElementById('anggotaList');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');

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

    const q = query(collection(db, 'users'), where('anggota', '==', 'true'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const anggotaDiv = document.createElement('div');
        anggotaDiv.className = 'anggota';

        // Dapatkan URL foto profil dari Firebase Storage
        const storage = getStorage();
        const profileImageRef = ref(storage, `profileImages/${doc.id}/profil.png`);
        const profileImageUrl = await getDownloadURL(profileImageRef);

        anggotaDiv.innerHTML = `
            <img src="${profileImageUrl}" alt="Foto Profil">
            <h2>${data.nama}</h2>
            <p>NPM: ${data.npm}</p>
            <p>Jabatan: ${data.jabatan}</p>
            <p>Jurusan: ${data.jurusan}</p>
            <p>Angkatan: ${data.angkatan}</p>
            <p>Divisi: ${data.divisi}</p>
            <p>Role: ${data.role}</p>
        `;

        anggotaDiv.addEventListener('click', () => {
            if (currentUserRole === 'admin') {
                selectedUserId = doc.id;
                popupContent.innerHTML = `
                    <img src="${profileImageUrl}" alt="Foto Profil">
                    <label for="nama">Nama:</label>
                    <input type="text" id="nama" value="${data.nama}">
                    <label for="npm">NPM:</label>
                    <input type="text" id="npm" value="${data.npm}">
                    <label for="jabatan">Jabatan:</label>
                    <input type="text" id="jabatan" value="${data.jabatan}">
                    <label for="jurusan">Jurusan:</label>
                    <input type="text" id="jurusan" value="${data.jurusan}">
                    <label for="angkatan">Angkatan:</label>
                    <input type="text" id="angkatan" value="${data.angkatan}">
                    <label for="divisi">Divisi:</label>
                    <input type="text" id="divisi" value="${data.divisi}">
                    <label for="role">Role:</label>
                    <select id="role">
                        <option value="user" ${data.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${data.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                `;
                popup.classList.add('active');
            }
        });

        anggotaList.appendChild(anggotaDiv);
    });

    saveButton.addEventListener('click', async () => {
        const nama = document.getElementById('nama').value;
        const npm = document.getElementById('npm').value;
        const jabatan = document.getElementById('jabatan').value;
        const jurusan = document.getElementById('jurusan').value;
        const angkatan = document.getElementById('angkatan').value;
        const divisi = document.getElementById('divisi').value;
        const role = document.getElementById('role').value;

        await updateDoc(doc(db, 'users', selectedUserId), {
            nama, npm, jabatan, jurusan, angkatan, divisi, role
        });

        popup.classList.remove('active');
        window.location.reload(); // Refresh halaman untuk menampilkan perubahan
    });

    deleteButton.addEventListener('click', async () => {
        await deleteDoc(doc(db, 'users', selectedUserId));

        // Hapus gambar profil dari Firebase Storage
        const storage = getStorage();
        const profileImageRef = ref(storage, `profileImages/${selectedUserId}/profil.png`);
        await deleteObject(profileImageRef);

        popup.classList.remove('active');
        window.location.reload(); // Refresh halaman untuk menghapus user dari tampilan
    });
});
