import { db, auth, storage } from './firebase/firebaseConfig.js'; // Pastikan firebaseConfig.js mengimpor dan mengekspor 'storage'
import { collection, getDocs, query, orderBy, limit, doc, getDoc, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId'); // Dapatkan User ID dari localStorage
    console.log('User ID:', userId); // Gunakan User ID
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userRole = userDoc.data().role;

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.nama; // Asumsi field username ada di dokumen

        const userSpan = document.getElementById('userEmail');
        userSpan.textContent = username; // Tampilkan username
    } else {
        console.log("Dokumen pengguna tidak ditemukan.");
    }

    const announcementsBox = document.querySelector('.announcementsBox');

    try {
        const announcementsQuery = query(collection(db, "announcements"), orderBy("date", "desc"), limit(10));
        const querySnapshot = await getDocs(announcementsQuery);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const announcementElement = document.createElement('div');
            announcementElement.classList.add('announcementDetails');
            announcementElement.innerHTML = `
                <div class="announcementInfo">
                    <h2 class="announcementSubject">${data.subject}</h2>
                    <h2 class="announcementDate">${data.date}</h2>
                </div>
                <textarea class="announcementRect" readonly>${data.description || ''}</textarea>
            `;
            announcementsBox.appendChild(announcementElement);
        });
    } catch (error) {
        console.error("Error loading announcements:", error);
        announcementsBox.innerHTML = '<p>Error loading announcements.</p>';
    }

    document.getElementById('homeLink').addEventListener('click', () => {
        window.location.href = 'main.html';
    });

    document.getElementById('profileLink').addEventListener('click', () => {
        window.location.href = 'profile_page.html';
    });

    document.getElementById('prokerLink').addEventListener('click', () => {
        window.location.href = 'programKerjaList.html';
    });

    document.getElementById('pengumumanLink').addEventListener('click', () => {
        window.location.href = 'pengumumanPage.html';
    });

    document.getElementById('anggotaLink').addEventListener('click', () => {
        window.location.href = 'pengelolaanAnggota.html';
    });

    document.getElementById('forumLink').addEventListener('click', () => {
        window.location.href = 'forumPage.html';
    });
});