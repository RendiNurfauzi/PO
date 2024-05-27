import { db, auth, storage } from './firebase/firebaseConfig.js'; // Pastikan firebaseConfig.js mengimpor dan mengekspor 'storage'
import { collection, getDocs, query, orderBy, limit, doc, getDoc, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("Tidak ada pengguna yang masuk.");
            window.location.href = 'login.html'; // Redirect ke halaman login jika tidak ada pengguna yang masuk
            return;
        }

        
    


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

        // Dapatkan koleksi 'users' dari Firestore
        const usersCollection = collection(db, 'users');

        // Buat query untuk mendapatkan dokumen di mana 'anggota' bernilai true
        const membersQuery = query(usersCollection, where('anggota', '==', 'true'));

        // Dapatkan snapshot dari query
        const membersSnapshot = await getDocs(membersQuery);
        console.log(membersSnapshot.docs);

        // Hitung jumlah dokumen dalam snapshot (jumlah anggota)
        const membersCount = membersSnapshot.size;
        

        // Tampilkan jumlah anggota di elemen dengan class 'membersCount'
        document.querySelector('.membersCount').textContent = membersCount;
        
        const announcementsBox = document.querySelector('.announcementsBox');
        const programBox = document.querySelector('.programBox');
        announcementsBox.innerHTML = '';
        programBox.innerHTML = '';

        const announcementsQuery = query(collection(db, "announcements"), orderBy("date", "desc"), limit(10));
        const programQuery = query(collection(db, "workPrograms"), orderBy("date", "desc"), limit(10));

        const querySnapshot = await getDocs(announcementsQuery);
        const programSnapshot = await getDocs(programQuery);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const announcementElement = document.createElement('div');
            announcementElement.classList.add('announcementDetails');
            announcementElement.innerHTML = `
                <div class="announcementInfo">
                    <h2 class="announcementSubject">${data.subject}</h2>
                    <h2 class="announcementDate">${data.date}</h2>
                </div>
                <textarea class="announcementRect">${data.description || ''}</textarea>
            `;
            if (userRole === 'admin') {
                const titleElement = document.querySelector('.titlePengumuman');
                titleElement.addEventListener('click', () => {
                    console.log('Judul Pengumuman diklik oleh admin');
                    window.location.href = 'postingPengumuman.html'; // Redirect ke halaman postingPengumuman.html
                });

                const titleElementProker = document.querySelector('.titleProgramKerja');
                titleElementProker.addEventListener('click', () => {
                    console.log('Judul proker diklik oleh admin');
                    window.location.href = 'postingProgram.html'; // Redirect ke halaman postingPengumuman.html
                });

                const titleElementOrganisasi = document.querySelector('.titleOrganisasi');
                titleElementOrganisasi.addEventListener('click', () => {
                    console.log('Judul organisasi diklik oleh admin');
                    window.location.href = 'postingOrganization.html'; // Redirect ke halaman postingPengumuman.html
                });
            }
            
            announcementsBox.appendChild(announcementElement);
        });

        programSnapshot.forEach((doc) => {
            const data = doc.data();
            const programElement = document.createElement('div');
            programElement.classList.add('programDetails');
            programElement.innerHTML = `
                <div class="programInfo">
                    <h2 class="programName">${data.name}</h2>
                    <h2 class="programDate">${data.date}</h2>
                </div>
                <textarea class="programRect">${data.description || ''}</textarea>
            `;
            if (userRole === 'admin') {
                programElement.addEventListener('click', () => {
                    console.log('Program kerja diklik oleh admin');
                });
            }
            programBox.appendChild(programElement);
        });

        const organizationDetails = document.querySelector('.organizationDetails');
        try {
            const docRef = doc(db, "organization", "details");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Mendapatkan URL gambar dari Firebase Storage
                const imageRef = ref(storage, 'organizationImages/logo.png');
                const imageUrl = await getDownloadURL(imageRef);

                organizationDetails.innerHTML = `
                    <img class="organizationImage" src="${imageUrl}" alt="Gambar Organisasi" />
                    <h2 class="organizationName">${data.name}</h2>
                    <h2 class="organizationFakultas">${data.faculty}</h2>
                    <h2 class="organizationJurusan">${data.department}</h2>
                    <h2 class="organizationYear">${data.year}</h2>
                `;
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }

        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            profileLink.addEventListener('click', function() {
                window.location.href = 'profile_page.html';
            });
        } else {
            console.log('Element with ID "profileLink" not found.');
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                auth.signOut()
                    .then(() => {
                        console.log('Pengguna berhasil logout');
                        window.location.href = 'LoginPage.html'; // Redirect ke halaman login setelah logout
                    })
                    .catch((error) => {
                        console.error('Error saat logout:', error);
                        alert('Gagal logout: ' + error.message);
                    });
            });
        } else {
            console.log('Element dengan id "logoutButton" tidak ditemukan.');
        }

        const titlePengumuman = document.querySelector('.titlePengumuman');

        document.getElementById('homeLink').addEventListener('click', () => {
            window.location.href = 'main.html';
        });

        document.getElementById('profileLink').addEventListener('click', () => {
            window.location.href = 'profile_page.html';
        });

        document.getElementById('prokerLink').addEventListener('click', () => {
            window.location.href = 'programKerjaPage.html';
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
});
