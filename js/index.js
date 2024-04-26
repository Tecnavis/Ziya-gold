import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';

let logoURL;

document.addEventListener('DOMContentLoaded', function () {
    displayDataInTable()
});

const firestore = getFirestore(app);


async function displayDataInTable() {
    const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

    if (!uid) {
        console.error('User not authenticated');
        return;
    }

    const userDocRef = collection(firestore, `users/${uid}/profile`);

    try {
        const querySnapshot = await getDocs(query(userDocRef, orderBy('timestamp', 'asc')));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // console.log(data);
            logoURL = data.photoUrl;

            document.getElementById('displayImage').src = data.photoUrl
            document.getElementById('displayName').textContent = data.name
            document.getElementById('displayEmail').textContent = data.email
            document.getElementById('displayNumber').textContent = data.phone
            document.getElementById('displayCity').textContent = data.city
        });
    } catch (error) {
        console.error('Error displaying data in table:', error);
    }
}

export {logoURL}