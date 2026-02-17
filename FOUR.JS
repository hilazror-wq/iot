// ================================
// Firebase config – DOGHOUSE בלבד
// ================================
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


// אתחול Firebase (פעם אחת)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// חיבור למסד
const db = firebase.database();

// הנתיב במסד
const DB_PATH = "contacts/messages";

// בדיקת אימייל
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// שליחת הטופס
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const messageEl = document.getElementById("message");
  const resultEl = document.getElementById("result");

  const email = emailEl.value.trim();
  const message = messageEl.value.trim();

  if (!email || !message) {
    alert("חובה למלא אימייל והודעה");
    return;
  }

  if (!isValidEmail(email)) {
    alert("אימייל לא תקין");
    return;
  }

  db.ref(DB_PATH).push({
    email: email,
    message: message,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  .then(() => {
    resultEl.textContent = "ההודעה נשלחה בהצלחה ✅";
    emailEl.value = "";
    messageEl.value = "";
  })
  .catch(err => {
    console.error(err);
    alert(err.code + " | " + err.message);
  });
});

// shorter ultrasonic listener — reads from /A (exact DB node) and pushes alerts
function startUltrasonicSimple(path = '/A', threshold = 20, cooldown = 30000) {
  if (!db) return console.error('DB not ready');
  let last = 0;
  const node = String(path).replace(/^\/+/, ''); // '/A' -> 'A'
  db.ref(node).on('value', snap => {
    const v = Number(snap.val());
    if (!isFinite(v)) return;
    if (v <= threshold && Date.now() - last >= cooldown) {
      last = Date.now();
      const payload = {
        sensor: 'ultrasonic',
        value: v,
        message: `Object detected (value=${v})`,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      db.ref(DB_PATH).push(payload).catch(console.error);
    }
  }, console.error);
}
startUltrasonicSimple('/A');



firebase.database().ref('/fromAltera/B').on('value', (snapshot) => {
  const data = snapshot.val();
  document.getElementById("gas").innerText = `Gas Sensor Value: ${data}`;

});