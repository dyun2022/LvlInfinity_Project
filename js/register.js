import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("register-form");

form.onsubmit = async () => {
  const email = form.email.value;
  const password = form.password.value;
  const username = form.username.value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      username,
      firstName, 
      lastName,
      bio: form.bio.value,
      class: form.class.value,
      techStack: [...form.techStack].filter(t => t.checked).map(t => t.value),
      rarity: 1,
      stats: {
        level: 1, 
        quests: 0, 
        streak: 0
      },
      createdAt: serverTimestamp()
    });

    window.location.href = "profile.html";
  } catch (err) {
    alert(err.message);
  }

  return false;
};
