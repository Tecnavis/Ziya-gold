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

// Configuration For Fixing Bugs When App is Live
// const firebaseConfig = {
//     apiKey: "AIzaSyBkXS5aN0HO1YOeZN9YC9Tl-X-lqVpz86w",
//     authDomain: "scratch-card-d1196.firebaseapp.com",
//     projectId: "scratch-card-d1196",
//     storageBucket: "scratch-card-d1196.appspot.com",
//     messagingSenderId: "633923933151",
//     appId: "1:633923933151:web:7a7ae3baa3b0bd90a26a6a"
// };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }