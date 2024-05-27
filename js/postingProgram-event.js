import { db } from './firebase/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('programForm');
    let logMessages = ""; // Variabel untuk menyimpan log

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const log = (message) => {
            console.log(message);
            logMessages += message + "\n"; // Menambahkan pesan ke log
        };

        const name = document.getElementById('name').value.trim();
        const eventDate = document.getElementById('date').value; // Tanggal dan waktu acara
        const description = document.getElementById('description').value.trim();
        const username = localStorage.getItem('username'); // Mengambil username dari localStorage

        // Memastikan semua field diisi
        if (!name || !eventDate || !description || !username) {
            log('Semua field harus diisi.');
            alert('Semua field harus diisi.');
            return;
        }

        const submissionDate = new Date().toISOString(); // Waktu pengiriman
        const eventDateISO = new Date(eventDate).toISOString(); // Pastikan tanggal dalam format ISO


        log('Form submission prevented.');
        log(`Data: ${name}, Event Date: ${eventDate}, Description: ${description}, Submitted by: ${username}`);

        try {
            const docRef = await addDoc(collection(db, "workPrograms"), {
                name: name,
                eventDate: eventDateISO, // Gunakan tanggal ISO
                description: description,
                username: username,
                submissionDate: new Date().toISOString() // Waktu pengiriman dalam format ISO
            });
            log('Document written with ID: ' + docRef.id);
            alert('Program kerja berhasil ditambahkan dengan ID: ' + docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
            log('Error adding document: ' + error);
            alert('Gagal menambahkan program kerja: ' + error.message);
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
