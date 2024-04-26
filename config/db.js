import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDwD9ezr1tlM_T0i4ewFiXKwJ7ostn28yg",
    authDomain: "scratch-card-a59f7.firebaseapp.com",
    projectId: "scratch-card-a59f7",
    storageBucket: "scratch-card-a59f7.appspot.com",
    messagingSenderId: "454428574981",
    appId: "1:454428574981:web:7c53d6ef35298e8569636c",
    measurementId: "G-L6XZ3W02FW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }