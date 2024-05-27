import { db, storage, auth } from './firebase/firebaseConfig.js';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js';

const messagesRef = collection(db, "messages");
const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

// Fungsi untuk menampilkan pesan
function displayMessage(id, timestamp, nama, text, profilePicUrl, fileUrl) {
    const messageElem = document.createElement("div");
    messageElem.innerHTML = `
        <div class="message" id="message-${id}">
            <img src="${profilePicUrl || 'default_profil.png'}" alt="Profil">
            <div class="message-info">
                <h5>${nama}</h5>
                <p>${text || ''}</p>
                ${fileUrl ? `<img src="${fileUrl}" alt="File" style="max-width: 200px;">` : ''}
                ${fileUrl && !/\.(jpg|jpeg|png|gif)$/i.test(fileUrl) ? `<a href="${fileUrl}" download="${fileUrl.split('/').pop()}">${fileUrl.split('/').pop()}</a>` : ''}
                <span>${new Date(timestamp).toLocaleTimeString()}</span>
            </div>
        </div>
    `;
    document.getElementById("messages").appendChild(messageElem);
}

// Mengambil pesan
onSnapshot(messagesQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            displayMessage(change.doc.id, data.timestamp, data.nama, data.text, data.profilePicUrl, data.fileUrl);
        }
    });
});

// Mengirim pesan dan/atau file
document.getElementById("sendButton").addEventListener("click", async () => {
    const messageInput = document.getElementById("messageInput");
    const text = messageInput.value.trim();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    const { uid } = auth.currentUser;
    const userRef = doc(db, "users", uid);
    const userProfile = await getDoc(userRef);
    const nama = userProfile.data().nama;
    const profilePicRef = ref(storage, `profileImages/${uid}/profil.png`);
    const profilePicUrl = await getDownloadURL(profilePicRef);

    let fileUrl = null;
    if (file) {
        const fileRef = ref(storage, `files/${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
    }

    if (text || file) {
        await addDoc(messagesRef, {
            nama,
            text,
            profilePicUrl,
            fileUrl,
            timestamp: Date.now()
        });

        messageInput.value = "";
        fileInput.value = "";
    } else {
        alert("Silakan masukkan pesan atau pilih file untuk dikirim.");
    }
});
