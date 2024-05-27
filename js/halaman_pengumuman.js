import { db } from './firebase/firebaseConfig.js'; // Pastikan path ini benar
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const announcementsContainer = document.querySelector('.announcementsContainer');
    const modal = document.getElementById("editModal");
    const span = document.getElementsByClassName("close")[0];
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const subjectInput = document.getElementById("subject");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const currentUserRole = localStorage.getItem('role');
    const announcementsQuery = query(collection(db, "announcements"), orderBy("date", "desc"), limit(10));
    const querySnapshot = await getDocs(announcementsQuery);

    querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const announcementElement = document.createElement('div');
        announcementElement.classList.add('announcementDetails');
        announcementElement.innerHTML = `
            <div class="announcementInfo">
                <h2 class="announcementSubject">${data.subject}</h2>
                <p class="announcementSender">Dikirim oleh: ${data.username}</p>
                <h2 class="announcementDate">Dikirim pada: ${new Date(data.date).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</h2>
            </div>
            <textarea class="announcementRect" readonly>${data.description || ''}</textarea>
        `;
        announcementsContainer.appendChild(announcementElement);

        if (currentUserRole === 'admin') {
            announcementElement.addEventListener('click', () => {
                modal.style.display = "block";
                subjectInput.value = data.subject;
                descriptionInput.value = data.description;
                dateInput.value = data.date;

                saveBtn.onclick = async () => {
                    await updateDoc(doc(db, "announcements", docSnapshot.id), {
                        subject: subjectInput.value,
                        description: descriptionInput.value,
                        date: dateInput.value
                    });
                    modal.style.display = "none";
                    window.location.reload();
                };

                deleteBtn.onclick = async () => {
                    await deleteDoc(doc(db, "announcements", docSnapshot.id));
                    modal.style.display = "none";
                    window.location.reload();
                };
            });
        }
    });
});

