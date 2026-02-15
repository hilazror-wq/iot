// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "PUT_YOUR_API_KEY",
  authDomain: "PUT_YOUR_AUTH_DOMAIN",
  databaseURL: "https://doghouse-ace9d-default-rtdb.firebaseio.com/",
  projectId: "doghouse-ace9d",
  storageBucket: "PUT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PUT_YOUR_MESSAGING_SENDER_ID",
  appId: "PUT_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== LOG IN =====
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginResult = document.getElementById("loginResult");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

// התחברות
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    loginResult.textContent = "התחברת בהצלחה ✅";
    loginForm.reset();
  } catch {
    loginResult.textContent = "לא הצליח להתחבר ❌";
  }
});

// הרשמה
signupBtn.addEventListener("click", async () => {
  if (!loginEmail.value || !loginPassword.value) {
    loginResult.textContent = "תמלאי אימייל וסיסמה ואז תלחצי הרשמה";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    loginResult.textContent = "נרשמת בהצלחה ✅";
    loginForm.reset();
  } catch {
    loginResult.textContent = "לא הצליח להירשם ❌";
  }
});

// התנתקות
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  loginResult.textContent = "התנתקת ✅";
});

// מצב משתמש (מחובר/לא)
onAuthStateChanged(auth, (user) => {
  if (user) {
    logoutBtn.classList.remove("d-none");
    signupBtn.classList.add("d-none");
    loginResult.textContent = "מחוברת: " + user.email;
  } else {
    logoutBtn.classList.add("d-none");
    signupBtn.classList.remove("d-none");
  }
});

// ===== דמו: צליל -> צבע =====
const light = document.getElementById("statusLight");
const text  = document.getElementById("statusText");

document.querySelectorAll("button[data-sound]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-sound");

    if (type === "dog") {
      light.style.background = "orange";
      text.textContent = "זוהתה נביחת כלב 🐶";
    }

    if (type === "door") {
      light.style.background = "yellow";
      text.textContent = "זוהה פעמון דלת 🚪";
    }

    if (type === "fire") {
      light.style.background = "red";
      text.textContent = "אזהרה: אזעקה 🚨";
    }
  });
});




