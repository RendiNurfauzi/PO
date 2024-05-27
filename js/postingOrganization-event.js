import { db } from './firebase/firebaseConfig.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";



document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('organizationForm');
    const imageInput = document.getElementById('image');

    // Dapatkan data dari Firestore dan tampilkan ke dalam form
    const docRef = doc(db, "organization", "details");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('name').value = data.name;
        document.getElementById('faculty').value = data.faculty;
        document.getElementById('department').value = data.department;
        document.getElementById('year').value = data.year;
        document.getElementById('organizationImage').src = data.imageUrl; // Tampilkan gambar yang sudah diunggah
    } else {
        console.log("No such document!");
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const faculty = document.getElementById('faculty').value.trim();
        const department = document.getElementById('department').value.trim();
        const year = document.getElementById('year').value.trim();
        const imageFile = imageInput.files[0];

        if (!imageFile) {
            alert('Gambar harus diunggah.');
            return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, 'organizationImages/logo.png'); // Ubah nama file menjadi "logo.png"

        try {
            const snapshot = await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);

            await setDoc(doc(db, "organization", "details"), {
                name: name,
                faculty: faculty,
                department: department,
                year: year,
                imageName: imageFile.name,
                imageUrl: imageUrl
            });
            alert('Informasi organisasi berhasil disimpan.');
        } catch (error) {
            console.error("Error saving document or uploading image: ", error);
            alert('Gagal menyimpan informasi atau mengunggah gambar: ' + error.message);
        }
    });

    // Gunakan container yang sudah ada di HTML
    const memberInfoContainer = document.querySelector('.member-info-container');

    const manageApplicationsButton = document.getElementById('manageApplicationsButton');
    const printMemberDataButton = document.getElementById('printMemberDataButton');
    const printApplicantDataButton = document.getElementById('printApplicantDataButton');

    manageApplicationsButton.addEventListener('click', () => {
        window.location.href = 'pengelolaanPendaftaran.html';
    });

    printMemberDataButton.addEventListener('click', async () => {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('anggota', '==', 'true')));
        let memberData = [];
        let counter = 1; // Inisialisasi counter untuk nomor baris
    
        querySnapshot.forEach(doc => {
            const data = doc.data();
            // Menambahkan data dengan struktur yang diinginkan
            memberData.push({
                No: counter, // Menambahkan nomor baris
                Nama: data.nama || '', // Ganti 'nama' dengan nama field yang sesuai di Firestore
                NPM: data.npm || '',
                Angkatan: data.angkatan || '',
                Jurusan: data.jurusan || '',
                Jabatan: data.jabatan || '',
                Divisi: data.divisi || '',
                Role: data.role || '',
                Email: data.email || ''
            });
            counter++; // Meningkatkan counter setiap kali data ditambahkan
        });
    
        // Fungsi untuk mengonversi data ke Excel dan mendownloadnya
        downloadDataAsFile(memberData, 'DataAnggota.xlsx');
    });
    printApplicantDataButton.addEventListener('click', async () => {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('anggota', '==', 'terdaftar')));
        let applicantData = [];
        let counter = 1; // Inisialisasi counter untuk nomor baris
    
        querySnapshot.forEach(doc => {
            const data = doc.data();
            // Menambahkan data dengan struktur yang diinginkan
            applicantData.push({
                No: counter, // Menambahkan nomor baris
                Nama: data.nama || '', // Ganti 'nama' dengan nama field yang sesuai di Firestore
                NPM: data.npm || '',
                Angkatan: data.angkatan || '',
                Jurusan: data.jurusan || '',
                Jabatan: data.jabatan || '',
                Divisi: data.divisi || '',
                Visi: data.visi || '',
                Misi: data.misi || '',
                Alasan: data.alasan || '',
                Email: data.email || ''
            });
            counter++; // Meningkatkan counter setiap kali data ditambahkan
        });
    
        // Fungsi untuk mengonversi data ke Excel dan mendownloadnya
        downloadDataAsFile(applicantData, 'DataPendaftar.xlsx');
    });

    function downloadDataAsFile(data, filename) {
        // Membuat workbook baru
        const workbook = XLSX.utils.book_new();
        // Mengonversi data JSON ke worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        // Menambahkan worksheet ke workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
        // Menentukan tipe file berdasarkan ekstensi filename
        const fileType = filename.endsWith('.xlsx') ? 'xlsx' : 'csv';
    
        // Menulis workbook ke file XLSX
        XLSX.writeFile(workbook, filename, { bookType: fileType });
    }

    async function updateCounts() {
        const membersQuery = query(collection(db, 'users'), where('anggota', '==', 'true'));
        const applicantsQuery = query(collection(db, 'users'), where('anggota', '==', 'terdaftar'));

        const membersSnapshot = await getDocs(membersQuery);
        const applicantsSnapshot = await getDocs(applicantsQuery);

        const memberCount = membersSnapshot.size; // Jumlah dokumen dengan anggota == true
        const applicantCount = applicantsSnapshot.size; // Jumlah dokumen dengan terdaftar == true

        document.getElementById('memberCount').textContent = memberCount;
        document.getElementById('applicantCount').textContent = applicantCount;
    }

    await updateCounts();
});

