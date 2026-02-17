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
  apiKey: "AIzaSyAXAdHg4YYbXUM_rRgc2nF2kYnJlEyInJ0",
  authDomain: "doghouse-ace9d.firebaseapp.com",
  databaseURL: "https://doghouse-ace9d-default-rtdb.firebaseio.com",
  projectId: "doghouse-ace9d",
  storageBucket: "doghouse-ace9d.firebasestorage.app",
  messagingSenderId: "590069271268",
  appId: "1:590069271268:web:ed7364dd50ba12f126baf1",
  measurementId: "G-JDKHE1R9YQ"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
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
// ===== 1) /fromAltera/B = distance in cm =====
(function () {
  const COOLDOWN_MS = 30_000; // 30 seconds between alerts
  const DIST_THRESHOLD_CM = 30;

  let lastState = null;       // 'near' or 'far'
  let lastAlertAt = 0;

  firebase.database().ref('/fromAltera/B').on('value', (snapshot) => {
    const raw = snapshot.val();
    const distanceCm = Number(raw);

    // validate
    if (!isFinite(distanceCm)) {
      console.debug('Invalid distance value from /fromAltera/B:', raw);
      return;
    }

    const isNear = distanceCm >= 0 && distanceCm < DIST_THRESHOLD_CM;
    const state = isNear ? 'near' : 'far';
    const message = isNear ? 'someone in your garden' : 'no one in your garden';

    // update UI element with id="gas"
    const el = document.getElementById('gas');
    if (el) {
      el.innerText = isNear
        ? `${message} (distance: ${distanceCm} cm)`
        : `${message} (distance: ${distanceCm} cm)`;
    }

    // alert only on state change and respecting cooldown
    if (state !== lastState) {
      const now = Date.now();
      if (!lastAlertAt || (now - lastAlertAt) > COOLDOWN_MS) {
        lastAlertAt = now;
        lastState = state;
        alert(message);
      } else {
        console.debug('Garden alert suppressed due to cooldown');
      }
    }
  }, (err) => {
    console.error('Firebase listener error for /fromAltera/B:', err);
  });
})();

// ===== 2) /fromAltera/C = gas value =====
(function () {
  const COOLDOWN_C_MS = 30_000;
  const GAS_THRESHOLD = 12;

  firebase.database().ref('/fromAltera/C').on('value', (snapshot) => {
    const raw = snapshot.val();
    const C = Number(raw);

    // validate
    if (!isFinite(C)) {
      console.debug('Invalid value from /fromAltera/C:', raw);
      return;
    }

    // if above 12 -> alert gasleak
    if (C > GAS_THRESHOLD) {
      const now = Date.now();
      if (!window._lastGasLeakAlertAt || (now - window._lastGasLeakAlertAt) > COOLDOWN_C_MS) {
        window._lastGasLeakAlertAt = now;
        alert('gasleak');
      }
    }
  }, (err) => {
    console.error('Firebase listener error for /fromAltera/C:', err);
  });
})();
