import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';
import { userID } from '../globals/globals.js';


const firestore = getFirestore(app);
document.addEventListener("DOMContentLoaded", function () {
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', saveChanges);
    }
});


function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
}

function formatDate(date) {
    let month = date.getMonth() + 1; // Month is zero based
    let day = date.getDate();
    let year = date.getFullYear();
    return month + '/' + day + '/' + year;
}

function timeStamp() {
    let date = new Date();
    let formattedDate = formatDate(date);
    let formattedTime = formatAMPM(date);
    return { date: formattedDate, time: formattedTime };
}

const timestamp = serverTimestamp();
// console.log(timestamp); // Output example: "4/29/2024 12:05:35 PM"


async function saveChanges() {
    const { date, time } = timeStamp();
    const uid = userID;

    const firstName = document.getElementById('inputFirstName').value.trim();
    const phoneNumber = document.getElementById('inputPhoneNumber').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const birthday = document.getElementById('inputBirthday').value.trim();
    const emirates = document.getElementById('inputEmirates').value.trim();
    const nationality = document.getElementById('inputNationality').value.trim();
    const state = document.getElementById('inputState').value.trim();
    const posNo = document.getElementById('inputPosNo').value.trim();
    const purchaseAmount = document.getElementById('inputPurchaseAmount').value.trim();

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Validate inputs
    if (validateInputs(firstName, phoneNumber, email, birthday, emirates, nationality, state, posNo, purchaseAmount)) {
        const userDocRef = collection(firestore, `users/${uid}/table`);

        // Check if posNo already exists
        const querySnapshot = await getDocs(query(userDocRef, where('posNo', '==', posNo)));
        if (!querySnapshot.empty) {
            // If posNo already exists, show error message
            // console.log('Position number already exists. Please choose another one.');
            const posErrorElement = document.getElementById('posError');
            posErrorElement.style.display = 'block';
            posErrorElement.innerHTML = 'Pos Number Already Exists'
            return; // Exit the function without saving
        }

        const dataToSave = {
            firstName: firstName,
            phoneNumber: phoneNumber,
            email: email,
            birthday: birthday,
            emirates: emirates,
            nationality: nationality,
            state: state,
            posNo: posNo,
            purchaseAmount: purchaseAmount,
            date: date,
            time: time,
            timestamp: timestamp,
        };

        try {
            const docRef = await addDoc(userDocRef, dataToSave);
            localStorage.setItem('num', phoneNumber);
            localStorage.setItem('purchase', purchaseAmount);
            document.getElementById('inputFirstName').value = '';
            document.getElementById('inputPhoneNumber').value = '';
            document.getElementById('inputEmail').value = '';
            document.getElementById('inputBirthday').value = '';
            document.getElementById('inputEmirates').value = '';
            document.getElementById('inputNationality').value = '';
            document.getElementById('inputState').value = '';
            document.getElementById('inputPosNo').value = '';
            document.getElementById('inputPurchaseAmount').value = '';
            window.location.href = '../pages/scratchCard.html';
        } catch (error) {
            showError('Error adding data to Firestore. Please try again later.');
        }
    }
}


function validateInputs(firstName, phoneNumber, email, birthday, emirates, nationality, state, posNo, purchaseAmount) {
    if (!firstName || !phoneNumber || !email || !birthday || !emirates || !nationality || !state || !posNo || !purchaseAmount) {
        showError('Please fill in all required fields.');
        return false;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        showError('Please enter a valid phone number.');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return false;
    }

    return true;
}

function showError(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}
