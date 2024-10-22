// Import and configure Firebase with the correct SDKs and version
// Ensure to replace the configuration with your actual Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyC11YnanQ7s81QHnTWApNBUcauPFuvJexk",
    authDomain: "soaa-f52ad.firebaseapp.com",
    projectId: "soaa-f52ad",
    storageBucket: "soaa-f52ad.appspot.com",
    messagingSenderId: "361344129776",
    appId: "1:361344129776:web:342fcf115b93bd8d800035"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Add Login Event Listener
document.getElementById("btnLogin").addEventListener('click', function (e) {
    e.preventDefault();
    
    // Get email and password from input fields
    const email = document.getElementById("txtEmail").value;
    const password = document.getElementById("txtPassword").value;

    // Authenticate the user with Firebase Auth
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Login successful
            alert("Login Successful!");
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error.message);
        });
});

// Add Signup Event Listener
document.getElementById("btnSignup").addEventListener('click', function (e) {
    e.preventDefault();
    
    // Get email and password from input fields
    const email = document.getElementById("txtEmail").value;
    const password = document.getElementById("txtPassword").value;

    // Create a new user with Firebase Auth
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signup successful
            alert("Signup Successful!");
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error.message);
        });
});
