import { db } from './firebase/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('announcementForm');
    let logMessages = ""; // Variabel untuk menyimpan log

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const log = (message) => {
            console.log(message);
            logMessages += message + "\n"; // Menambahkan pesan ke log
        };

        const subject = document.getElementById('subject').value.trim();
        const description = document.getElementById('description').value.trim();
        const username = localStorage.getItem('username');

        // Memastikan semua field diisi
        if (!subject || !description || !username) {
            log('Semua field harus diisi.');
            alert('Semua field harus diisi.');
            return;
        }

        // Mendapatkan tanggal dan waktu saat ini
        const now = new Date();
        const date = now.toISOString(); // Format ISO 8601

        log('Form submission prevented.');
        log('Data: ' + subject + ', ' + date + ', ' + description + ', ' + username);

        try {
            const docRef = await addDoc(collection(db, "announcements"), {
                subject: subject,
                date: date,
                description: description,
                username: username // Menambahkan username ke dokumen
            });
            log('Document written with ID: ' + docRef.id);
            alert('Pengumuman berhasil ditambahkan dengan ID: ' + docRef.id);


        } catch (error) {
            console.error("Error adding document: ", error);
            log('Error adding document: ' + error);
            alert('Gagal menambahkan pengumuman: ' + error.message);
        }

        // Fungsi untuk mengunduh log
        const downloadLog = () => {
            const blob = new Blob([logMessages], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'log.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        };

        // Panggil fungsi downloadLog untuk mengunduh file log
        downloadLog();
    });
});
