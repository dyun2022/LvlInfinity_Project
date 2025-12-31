import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById("login-form");

form.onsubmit = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      form.email.value,
      form.password.value
    );

    window.location.href = "profile.html";
  } catch (err) {
    alert("Invalid login");
  }

  return false;
};
