import { auth, db } from "../../firebase/firebase-config.js";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const board = document.getElementById("board").value;
    const school = document.getElementById("school").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        // Create Firebase Authentication Account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Save Student Data in Firestore
        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,

            name: name,

            email: email,

            mobile: mobile,

            class: studentClass,

            board: board,

            school: school,

            role: "student",

            emailVerified: false,

            createdAt: serverTimestamp()

        });

        // Send Verification Email
        await sendEmailVerification(user);

        alert("Account created successfully!\nPlease verify your email before logging in.");

        window.location.href = "verify-email.html";

    }

    catch (error) {

        alert(error.message);

    }

});