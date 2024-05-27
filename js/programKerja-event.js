import { db } from './firebase/firebaseConfig.js';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const programsContainer = document.querySelector('.programsContainer');
    const modal = document.getElementById("editModal");
    const span = document.getElementsByClassName("close")[0];
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const nameInput = document.getElementById("name");
    const dateInput = document.getElementById("date");
    const descriptionInput = document.getElementById("description");

    programsContainer.innerHTML = ''; // Bersihkan kontainer jika ada konten sebelumnya

    const programQuery = query(collection(db, "workPrograms"), orderBy("submissionDate", "desc"), limit(10));
    const querySnapshot = await getDocs(programQuery);

    querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const programElement = document.createElement('div');
        programElement.classList.add('programDetails');
        programElement.innerHTML = `
            <div class="programInfo">
                <h2 class="programName">${data.name}</h2>
                <p class="programSender">Dikirim oleh: ${data.username}</p>
                <p class="programDate">Tanggal Acara: ${new Date(data.eventDate).toLocaleString('id-ID')}</p>
                <p class="programSubmissionDate">Dikirim pada: ${new Date(data.submissionDate).toLocaleString('id-ID')}</p>
            </div>
            <textarea class="programRect" readonly>${data.description || ''}</textarea>
        `;
        programsContainer.appendChild(programElement);

        programElement.addEventListener('click', () => {
            if (localStorage.getItem('role') === 'admin') {
                modal.style.display = "block";
                nameInput.value = data.name;
                dateInput.value = data.eventDate;
                descriptionInput.value = data.description;

                saveBtn.onclick = async () => {
                    await updateDoc(doc(db, "workPrograms", docSnapshot.id), {
                        name: nameInput.value,
                        eventDate: dateInput.value,
                        description: descriptionInput.value
                    });
                    modal.style.display = "none";
                    window.location.reload();
                };

                deleteBtn.onclick = async () => {
                    await deleteDoc(doc(db, "workPrograms", docSnapshot.id));
                    modal.style.display = "none";
                    window.location.reload();
                };
            }
        });
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});