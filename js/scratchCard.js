import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    orderBy,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';
import { logoURL } from './index.js'

const firestore = getFirestore(app);
const timestamp = serverTimestamp()

let winnerID, dateTime, prize;


// Function to retrieve data from Firebase and initialize scratch card
async function retrieveDataAndInitializeScratchCard() {
    const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

    if (!uid) {
        console.error('User not authenticated');
        return;
    }

    const userDocRef = collection(firestore, `users/${uid}/prizeList`);

    try {
        const querySnapshot = await getDocs(query(userDocRef, orderBy('timestamp', 'asc')));
        const cardsData = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            cardsData.push(data);
        });

        // Sort cardsData array based on count in descending order
        cardsData.sort((a, b) => b.count - a.count);

        // Check if there are available cards
        if (cardsData.length > 0) {
            const card = cardsData[0]; // Select the first card (highest count)

            // Check if counts are available
            if (card.count > 0) {
                initializeScratchCard(card);
            } else {
                // If counts are not available, handle it accordingly (e.g., show a message).
                console.log("No counts available for this card.");
            }
        } else {
            console.log("No scratch cards available for this user.");
        }
    } catch (error) {
        console.error('Error retrieving data from Firebase:', error);
    }
}


// Function to initialize scratch card with data
function initializeScratchCard(cardData) {
    // Define a variable to store a reference to the timeout
    let scratchMoveTimeout;

    $("#card").wScratchPad({
        size: 100,
        bg: cardData.photoUrl,
        fg: "../Images/8802794.png",
        cursor: "pointer",
        scratchMove: function (e, percent) {
            // Clear the previous timeout
            clearTimeout(scratchMoveTimeout);

            // Set a new timeout to call updateCount after a delay of 500 milliseconds
            scratchMoveTimeout = setTimeout(() => {
                // If scratch reaches a certain threshold (e.g., 50%), update count in database
                if (percent > 50) {
                    updateCount(cardData);
                }
            }, 1000); // Adjust the delay as needed
        }
    });
}

function updateCount(cardData) {
    const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

    // Reference to the "prizeList" collection
    const cardRef = collection(firestore, `users/${uid}/prizeList`);

    // Use where clause to target the specific document based on its ID
    const querys = query(cardRef, where('prizeID', '==', cardData.prizeID));

    getDocs(querys)
        .then(async (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                console.log(doc.id);
                await updateDoc(doc.ref, {
                    count: cardData.count - 1 // Decrease count by 1
                }).then(async () => {
                    console.log("Count updated successfully.");

                    // Get the phone number from localStorage
                    var number = localStorage.getItem('num');

                    if (!number) {
                        window.location.href = './form.html'
                    }

                    const winID = generateCustomId(number);

                    // Reference to the "table" collection
                    const tableRef = collection(firestore, `users/${uid}/table`);

                    // Query to find the document where phoneNumber matches
                    const tableQuery = query(tableRef, where('phoneNumber', '==', number));

                    // Fetch the matching document
                    const tableQuerySnapshot = await getDocs(tableQuery);

                    // Update the field inside the document
                    tableQuerySnapshot.forEach(async (tableDoc) => {
                        await updateDoc(tableDoc.ref, {
                            // Add a new field to the document
                            winID: winID,
                            prizeID: cardData.prizeID // newValue is the value you want to assign to the new field
                        }).then(() => {
                            console.log("New field added successfully to the table document.");
                            document.getElementById('successMessage').style.display = 'block'
                            document.getElementById('winID').textContent = winID;

                            const now = new Date();

                            const dateString = now.toLocaleDateString(); // Get date string in locale-specific format
                            const hours = formatTimePart(now.getHours());
                            const minutes = formatTimePart(now.getMinutes());
                            const seconds = formatTimePart(now.getSeconds());
                            const timeString = hours + ':' + minutes + ':' + seconds;

                            winnerID = winID;
                            prize = cardData.prizeName;
                            dateTime = dateString + '  ' + timeString;

                            // Auto Download Image
                            autoDownload();
                        }).catch((error) => {
                            console.error("Error adding new field to the table document: ", error);
                        });
                    });
                }).catch((error) => {
                    console.error("Error updating count: ", error);
                });
            });
        })
        .catch((error) => {
            console.error("Error updating count: ", error);
        });
}



// Call the function to retrieve data from Firebase and initialize scratch card
retrieveDataAndInitializeScratchCard();

function generateCustomId(num) {
    // Convert the number to a string
    const numString = num.toString();

    // Get the current date and time in the format YYYYMMDDHHMMSS
    const now = new Date();
    const timestamp = [
        now.getFullYear(),
        ('0' + (now.getMonth() + 1)).slice(-2),
        ('0' + now.getDate()).slice(-2),
    ].join('');

    // Combine the number and timestamp to create the ID
    const customId = numString + timestamp;

    return customId;
}


function formatTimePart(part) {
    return part < 10 ? '0' + part : part;
}

// Function to handle automatic download
function autoDownload() {
    // Create a canvas element to draw the image, logo, and text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on your image size
    canvas.width = 2000; // Adjust as per your image dimensions
    canvas.height = 2000; // Adjust as per your image dimensions

    // Load your main image
    const img = new Image();
    img.src = '../congratulations-ziya-gold.jpg'; // Replace with your image path 
    img.onload = function () {
        // Draw your main image on canvas
        ctx.drawImage(img, 0, 0);

        // Add text
        ctx.font = '100px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(prize, 800, 1550); // Adjust position as needed
        ctx.fillText(winnerID, 500, 1700);
        ctx.fillText(dateTime, 600, 1850);

        // Append canvas to document body
        document.body.appendChild(canvas);

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/png");

        // Create a link element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'prize-details.png'; // Filename

        // Trigger click event on the link to download the image
        link.click();

        // Remove canvas from document body
        document.body.removeChild(canvas);

        const num = localStorage.getItem('num');
        if (num) {
            localStorage.removeItem('num');
            // Redirect to index page
            window.location.href = '../index.html'
        }
    };
}


