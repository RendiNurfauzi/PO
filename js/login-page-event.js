import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.loginButton');
    const emailInput = document.querySelector('.emailInput');
    const passwordInput = document.querySelector('.passwordInput');
    const auth = getAuth();

    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;
        document.body.style.backgroundPosition = `${x}% ${y}%`;

    });

    loginButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .then((userCredential) => {
                console.log('Login berhasil:', userCredential.user);
                localStorage.setItem('userEmail', userCredential.user.email);
                localStorage.setItem('userId', userCredential.user.uid); // Simpan User ID
                // Tunggu hingga autentikasi benar-benar selesai
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        window.location.href = 'directLink.html'; // Redirect ke halaman utama
                    }
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error saat login:', errorCode, errorMessage);
                alert('Login gagal: ' + errorMessage); // Tampilkan pesan error
            });
    });

    const registerTitle = document.querySelector('.registerTitle');
    if (registerTitle) {
        registerTitle.addEventListener('click', function() {
            window.location.href = 'Daftar.html'; // Redirect ke halaman daftar saat diklik
        });
    } else {
        console.log('Element dengan class "registerTitle" tidak ditemukan.');
    }
});
