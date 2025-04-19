<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, confirm } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
    import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDVUzBgRChD8FhdgMoKosCLpLX3zGgWB_0",
        authDomain: "money-master-official-site-new.firebaseapp.com",
        projectId: "money-master-official-site-new",
        storageBucket: "money-master-official-site-new.firebasestorage.app",
        messagingSenderId: "580013071708",
        appId: "1:580013071708:web:76363a43638401cda07599",
        measurementId: "G-26CBLGCKC1"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let recaptchaVerifier = null;

    document.addEventListener('DOMContentLoaded', () => {
        recaptchaVerifier = new RecaptchaVerifier('createAccountButton', {
            'size': 'invisible',
            'callback': (token) => {
                const registrationType = document.getElementById('mobileRadio').checked ? 'mobile' : 'email';
                handleRegistration(registrationType, token);
            },
            'expired-callback': () => {
                showError('reCAPTCHA verification expired. Please try again.');
            }
        }, auth);

        document.getElementById('createAccountForm').addEventListener('submit', handleCreateAccount);
        setupToggleButtons();
    });

    function setupToggleButtons() {
        const emailButton = document.getElementById('emailButton');
        const mobileButton = document.getElementById('mobileButton');
        const emailMobileInput = document.getElementById('emailMobile');

        emailButton.addEventListener('click', () => {
            setActiveToggle('email');
            emailMobileInput.placeholder = 'Email';
        });

        mobileButton.addEventListener('click', () => {
            setActiveToggle('mobile');
            emailMobileInput.placeholder = 'Mobile Number (10 digits)';
        });
    }

    function setActiveToggle(type) {
        document.getElementById('emailButton').classList.remove('active');
        document.getElementById('mobileButton').classList.remove('active');
        document.getElementById(`${type}Button`).classList.add('active');
        document.getElementById('emailRadio').checked = (type === 'email');
        document.getElementById('mobileRadio').checked = (type === 'mobile');
        window.confirmationResult = null; // Reset OTP verification state
        clearError();
    }

    async function handleCreateAccount(e) {
        e.preventDefault();
        clearError();

        const fullName = document.getElementById('fullName').value.trim();
        const emailOrMobile = document.getElementById('emailMobile').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registrationType = document.getElementById('mobileRadio').checked ? 'mobile' : 'email';

        if (!fullName) {
            showError('Please enter your full name.');
            return;
        }

        if (!emailOrMobile) {
            showError(`Please enter your ${registrationType === 'email' ? 'email' : 'mobile number'}.`);
            return;
        }

        if (registrationType === 'mobile' && !/^\d{10}$/.test(emailOrMobile)) {
            showError('Please enter a valid 10-digit mobile number.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        try {
            const token = await grecaptcha.enterprise.execute('6LeFqjUpAAAAAIzY-55jSl_z4_mI_l4q91_VvS', { action: 'create_account' });
            await handleRegistration(registrationType, token, fullName, emailOrMobile, password);
        } catch (error) {
            console.error("reCAPTCHA error:", error);
            showError('Failed to verify reCAPTCHA. Please try again.');
        }
    }

    async function handleRegistration(registrationType, recaptchaToken, fullName, emailOrMobile, password) {
        try {
            let userCredential;
            if (registrationType === 'email') {
                userCredential = await createUserWithEmailAndPassword(auth, emailOrMobile, password);
                await saveUserData(userCredential.user.uid, fullName, emailOrMobile, null);
                alert('Account created successfully!');
                window.location.href = 'index.html'; // Redirect as needed
            } else if (registrationType === 'mobile') {
                if (!window.confirmationResult) {
                    await requestOTP(emailOrMobile);
                    return; // Wait for OTP verification
                }
                const otp = prompt('Enter the OTP sent to your mobile number:');
                if (otp) {
                    const result = await confirm(window.confirmationResult, otp);
                    await saveUserData(result.user.uid, fullName, null, emailOrMobile);
                    alert('Phone number verified and account created!');
                    window.location.href = 'index.html'; // Redirect as needed
                } else {
                    alert('OTP cannot be empty.');
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            showError(`Registration failed: ${error.message}`);
            if (recaptchaVerifier) {
                recaptchaVerifier.render().then(function(widgetId) {
                    grecaptcha.reset(widgetId);
                });
            }
        }
    }

    async function requestOTP(mobileNumber) {
        try {
            window.confirmationResult = await signInWithPhoneNumber(auth, '+91' + mobileNumber, recaptchaVerifier);
            alert('OTP sent to your mobile number.');
        } catch (error) {
            console.error("Error sending OTP:", error);
            showError(`Error sending OTP: ${error.message}`);
            if (recaptchaVerifier) {
                recaptchaVerifier.render().then(function(widgetId) {
                    grecaptcha.reset(widgetId);
                });
            }
        }
    }

    async function saveUserData(uid, fullName, email, mobile) {
        try {
            const registrationDate = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
            const formattedRegistrationDate = registrationDate.toLocaleDateString('en-IN', options);

            const userData = {
                uid: uid,
                fullName: fullName,
                email: email || null,
                mobile: mobile || null,
                coinBalance: 0,
                registrationDate: formattedRegistrationDate,
                registrationTimestamp: serverTimestamp()
            };
            await setDoc(doc(db, 'users', uid), userData);
            console.log('User data saved to Firestore');
        } catch (error) {
            console.error('Error saving user data to Firestore:', error);
            alert('Error saving user data.');
        }
    }

    function showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorMessage').style.display = 'block';
    }

    function clearError() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = '';
    }
</script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const emailButton = document.getElementById('emailButton');
        const mobileButton = document.getElementById('mobileButton');
        const emailMobileInput = document.getElementById('emailMobile');

        emailButton.addEventListener('click', () => {
            emailButton.classList.add('active');
            mobileButton.classList.remove('active');
            emailMobileInput.placeholder = 'Email';
        });

        mobileButton.addEventListener('click', () => {
            mobileButton.classList.add('active');
            emailButton.classList.remove('active');
            emailMobileInput.placeholder = 'Mobile Number (10 digits)';
        });
    });
</script>
