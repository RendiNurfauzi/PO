import { db, auth, storage } from './firebase/firebaseConfig.js'; // Pastikan firebaseConfig.js mengimpor dan mengekspor 'storage'
import { collection, getDocs, query, orderBy, limit, doc, getDoc, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;
        document.body.style.backgroundPosition = `${x}% ${y}%`;
    });

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
            const membersImage = document.querySelector('.membersImage');
            const membersName = document.querySelector('.membersName');
            const membersNPM = document.querySelector('.membersNPM');
            const membersDivisi = document.querySelector('.membersDivisi');
            const membersJabatan = document.querySelector('.membersJabatan');
            const membersAngkatan = document.querySelector('.membersAngkatan');

            // Set text content from Firestore data
            membersName.textContent = userData.nama || 'Nama tidak tersedia';
            membersNPM.textContent = userData.npm || 'NPM tidak tersedia';
            membersDivisi.textContent = userData.divisi || 'Divisi tidak tersedia';
            membersJabatan.textContent = userData.jabatan || 'Jabatan tidak tersedia';
            membersAngkatan.textContent = userData.angkatan || 'Angkatan tidak tersedia';

            // Get profile image from Firebase Storage
            const profileImageRef = ref(storage, `profileImages/${userId}/profil.png`);
            getDownloadURL(profileImageRef)
                .then((url) => {
                    membersImage.src = url;
                })
                .catch((error) => {
                    console.error("Error loading profile image:", error);
                    membersImage.src = 'path/to/default/image.png'; // Provide a default image path
                });
        } else {
            console.log("No such document!");
        }

        // Dapatkan koleksi 'users' dari Firestore
        const usersCollection = collection(db, 'users');

        // Buat query untuk mendapatkan dokumen di mana 'anggota' bernilai true
        const membersQuery = query(usersCollection, where('anggota', '==', 'true'));

        // Dapatkan snapshot dari query
        const membersSnapshot = await getDocs(membersQuery);
        console.log(membersSnapshot.docs);

        // Hitung jumlah dokumen dalam snapshot (jumlah anggota)

        
        const announcementsBox = document.querySelector('.announcementsBox');
        const programsContainer = document.querySelector('.programBox'); // Pastikan ini sesuai dengan kelas di HTML

        const programBox = document.querySelector('.programBox');
        announcementsBox.innerHTML = '';
        programBox.innerHTML = '';

        const announcementsQuery = query(collection(db, "announcements"), orderBy("date", "desc"), limit(10));
        const programQuery = query(collection(db, "workPrograms"), orderBy("submissionDate", "desc"), limit(10));

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
                <textarea class="announcementRect" readonly>${data.description || ''}</textarea>
            `;
            if (userRole === 'admin') {
                const titleElement = document.querySelector('.announcementsSection');
                titleElement.addEventListener('click', () => {
                    console.log('Judul Pengumuman diklik oleh admin');
                    window.location.href = 'postingPengumuman.html'; // Redirect ke halaman postingPengumuman.html
                });

                const titleElementProker = document.querySelector('.workProgramSection');
                titleElementProker.addEventListener('click', () => {
                    console.log('Judul proker diklik oleh admin');
                    window.location.href = 'postingProgram.html'; // Redirect ke halaman postingPengumuman.html
                });

                const titleElementOrganisasi = document.querySelector('.organizationSection');
                titleElementOrganisasi.addEventListener('click', () => {
                    console.log('Judul organisasi diklik oleh admin');
                    window.location.href = 'postingOrganization.html'; // Redirect ke halaman postingPengumuman.html
                });
            }
            const membersSectionBox = document.querySelector('.membersSection');
            membersSectionBox.addEventListener('click', () => {
                console.log('Judul profile diklik ');
                window.location.href = 'profile_page.html'; // Redirect ke halaman postingPengumuman.html
            });
            
            
            announcementsBox.appendChild(announcementElement);
        });
    querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const programElement = document.createElement('div');
        programElement.classList.add('programDetails');
        programElement.innerHTML = `
            <div class="programInfo">
                <h2 class="programName">${data.name}</h2>
                <p class="programDate">Tanggal Acara: ${new Date(data.eventDate).toLocaleString('id-ID')}</p>
            </div>
            <textarea class="programRect" readonly>${data.description || ''}</textarea>
        `;
        programsContainer.appendChild(programElement);
        
            if (userRole === 'admin') {
                programElement.addEventListener('click', () => {
                    console.log('Program kerja diklik oleh admin');
                });
            }
    
        });

        const organizationDetails = document.querySelector('.organizationDetails');
        try {
            const docRef = doc(db, "organization", "details");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Update teks tanpa menghapus elemen lain
                document.querySelector('.organizationName').textContent = data.name;
                document.querySelector('.organizationFakultas').textContent = data.faculty;
                document.querySelector('.organizationJurusan').textContent = data.department;
                document.querySelector('.organizationYear').textContent = data.year;

                // Mendapatkan URL gambar dari Firebase Storage
                const imageRef = ref(storage, 'organizationImages/logo.png');
                const imageUrl = await getDownloadURL(imageRef);
                document.querySelector('.organizationImage').src = imageUrl;
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }

        const titlePengumuman = document.querySelector('.titlePengumuman');
    });
});
