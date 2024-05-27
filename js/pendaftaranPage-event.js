import { db, auth, storage } from "./firebase/firebaseConfig.js";
import { setDoc, doc,updateDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

document.getElementById('pendaftaranForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Ambil nilai dari setiap field di form
    const fotoProfil = document.getElementById('fotoProfil').files[0];
    const nama = document.getElementById('nama').value;
    const npm = document.getElementById('npm').value;
    const jabatan = document.getElementById('jabatan').value;
    const jurusan = document.getElementById('jurusan').value;
    const angkatan = document.getElementById('angkatan').value;
    const divisi = document.getElementById('divisi').value;
    const alasan = document.getElementById('alasan').value;
    const visi = document.getElementById('visi').value;
    const misi = document.getElementById('misi').value;

    // Buat referensi ke lokasi di storage di mana foto profil akan disimpan
    // Gunakan 'profil.png' sebagai nama file
    const fotoProfilRef = ref(storage, `profileImages/${auth.currentUser.uid}/profil.png`);

    // Unggah foto profil ke Firebase Storage
    const snapshot = await uploadBytes(fotoProfilRef, fotoProfil);

    // Dapatkan URL download untuk foto profil
    const fotoProfilUrl = await getDownloadURL(fotoProfilRef);

    // Simpan data form ke Firestore
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
        fotoProfil: fotoProfilUrl,
        nama: nama,
        npm: npm,
        jabatan: jabatan,
        jurusan: jurusan,
        angkatan: angkatan,
        divisi: divisi,
        alasan: alasan,
        visi: visi,
        misi: misi,
        anggota: "terdaftar",
        firstLogin: "true"
    });

    alert('Pendaftaran berhasil!');
});
