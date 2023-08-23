// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {getAuth,signInWithPopup, GoogleAuthProvider ,signOut, onAuthStateChanged} from 'firebase/auth';
import {getFirestore,addDoc,collection,query,
orderBy,
onSnapshot,doc,
setDoc,
where} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
      apiKey: "AIzaSyB57KcjGbKJx3zyUt3aCMPCADIANJBxVf4",
      authDomain: "fir-web-codelab-1df0e.firebaseapp.com",
      projectId: "fir-web-codelab-1df0e",
      storageBucket: "fir-web-codelab-1df0e.appspot.com",
      messagingSenderId: "854736492646",
      appId: "1:854736492646:web:02a19ba954bfff3d9db5a7"
   };
  

  // initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
auth = getAuth();
db = getFirestore();
auth.languageCode = 'it';
  // FirebaseUI config
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      
      GoogleAuthProvider .PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

   const ui = new firebaseui.auth.AuthUI(auth);


   // Listen to RSVP button clicks
  // Called when the user clicks the RSVP button
startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});


 // Listen to the current Auth state
 onAuthStateChanged(auth, user => {
  if (user) {
    startRsvpButton.textContent = 'تسجيل الخروج';
    //إظهار الدردشة اذا كان مسجل دخول
    guestbookContainer.style.display = 'block';
    subscribeGuestbook();
  } else {
    startRsvpButton.textContent = 'تسجيل الدخول';
    //اخفاء الدردشة اذا لم يسجل دخول
    guestbookContainer.style.display='none';
    unsubscribeGuestbook();
  }
});


// Listen to the form submission
form.addEventListener('submit', async e => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  addDoc(collection(db, 'guestbook'), {
    text: input.value,
    timestamp: Date.now(),
    name: auth.currentUser.displayName,
    userId: auth.currentUser.uid
  });
  // clear message input field
  input.value = '';
  // Return false to avoid redirect
  return false;
});


// Create query for messages
const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
onSnapshot(q, snaps => {
  // Reset page
  guestbook.innerHTML = '';
  // Loop through documents in database
  snaps.forEach(doc => {
    // Create an HTML entry for each document and add it to the chat
    const entry = document.createElement('l');
    entry.textContent = doc.data().name + ': ' + doc.data().text;
    guestbook.appendChild(entry);
  });
});

/*const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
onSnapshot(q, snaps => {
  // Reset page
  guestbook.innerHTML = '';
  // Loop through documents in database
  snaps.forEach(doc => {
    // Create an HTML entry for each document and add it to the chat
    const arr = [];
    const personName = document.createElement('p');
    const dista = document.createElement('br');
    const personMessage = document.createElement('p');
personName.textContent =doc.data().name;
personMessage.textContent =doc.data().text;

arr.push(personName, dista, personMessage);
    //const entry = document.createElement('p');
    //entry.textContent = doc.data().name + ': ' + doc.data().text;
    guestbook.append(arr);
  });
});*/

// Listen to guestbook updates
function subscribeGuestbook() {
  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
  guestbookListener = onSnapshot(q, snaps => {
    // Reset page
    guestbook.innerHTML = '';
    // Loop through documents in database
    snaps.forEach(doc => {
      // Create an HTML entry for each document and add it to the chat
      //const entry = document.createElement('p');
      //entry.textContent = doc.data().name + ': ' + doc.data().text;
      //const arr = [];
    const personName = document.createElement('h3');
    const dista = document.createElement('footer');
    const buttd = document.createElement('button');
    const edit = document.createElement('button');
    const delet = document.createElement('button');

    const butt = document.createElement('button');
    const img = document.createElement('button');
    const space = document.createElement('br');
    const row = document.createElement('hr');

    butt.setAttribute("style","size:small;");
    row.setAttribute("style","border-size:3px;");

    img.innerHTML='<i class="material-icons">person</i>';
    
      butt.innerHTML='<i class="material-icons">thumb_up</i>';
      buttd.innerHTML='<i class="material-icons">reply</i>';
      edit.innerHTML='<i class="material-icons">edit</i>';
      delet.innerHTML='<i class="material-icons">delete</i>';

    const personMessage = document.createElement('p');
personName.textContent =doc.data().name;
personMessage.textContent =doc.data().text;
//arr.push(personName, dista, personMessage);
personName.setAttribute("style","font-size:large");
personName.setAttribute("style","color:purple");

      
    guestbook.appendChild(img);
    guestbook.appendChild(personName);
      guestbook.appendChild(personMessage);
      guestbook.appendChild(dista);
      guestbook.appendChild(butt);
      guestbook.appendChild(buttd);
      guestbook.appendChild(edit);
      guestbook.appendChild(delet);

      guestbook.appendChild(space);
      guestbook.appendChild(row);

     // guestbook.append(arr);
     butt.onclick = async () => {
  const nmbrs = snap.docs.length;
butt.textContent=guestbookListener;
     }

    });
  });}

  // ...
// Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}
// Listen to RSVP responses
rsvpYes.onclick = async () => {
  // Get a reference to the user's document in the attendees collection
  const userRef = doc(db, 'attendees', auth.currentUser.uid);

  // If they RSVP'd yes, save a document with attendi()ng: true
  try {
    await setDoc(userRef, {
      attending: true

    });
  } catch (e) {
    console.error(e);
  }
};
rsvpNo.onclick = async () => {
  // Get a reference to the user's document in the attendees collection
  const userRef = doc(db, 'attendees', auth.currentUser.uid);

  // If they RSVP'd yes, save a document with attending: true
  try {
    await setDoc(userRef, {
      attending: false
    });
  } catch (e) {
    console.error(e);
  }
};

// Listen for attendee list
const attendingQuery = query(
  collection(db, 'attendees'),
  where('attending', '==', true)
);
const unsubscribe = onSnapshot(attendingQuery, snap => {
  const newAttendeeCount = snap.docs.length;
  numberAttending.innerHTML = newAttendeeCount + ' عدد المعجبين';
});

// Listen for attendee list
function subscribeCurrentRSVP(user) {
  const ref = doc(db, 'attendees', user.uid);
  rsvpListener = onSnapshot(ref, doc => {
    if (doc && doc.data()) {
      const attendingResponse = doc.data().attending;

      // Update css classes for buttons
      if (attendingResponse) {
        rsvpYes.className = 'clicked';
        rsvpNo.className = '';
      } else {
        rsvpYes.className = '';
        rsvpNo.className = 'clicked';
      }
    }
  });


}function unsubscribeCurrentRSVP() {
  if (rsvpListener != null) {
    rsvpListener();
    rsvpListener = null;
  }
  rsvpYes.className = '';
  rsvpNo.className = '';
}

//اتصل بالوظائف من مستمع المصادقة
// Listen to the current Auth state
  // Listen to the current Auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      startRsvpButton.textContent = 'تسجيل الخروج';
      // Show guestbook to logged-in users
      guestbookContainer.style.display = 'block';

      // Subscribe to the guestbook collection
      subscribeGuestbook();
      // Subcribe to the user's RSVP
      subscribeCurrentRSVP(user);
    } else {
      startRsvpButton.textContent = 'تسجيل الدخول';
      // Hide guestbook for non-logged-in users
      guestbookContainer.style.display = 'none'
      ;
      // Unsubscribe from the guestbook collection
      unsubscribeGuestbook();
      // Unsubscribe from the guestbook collection
      unsubscribeCurrentRSVP();
    }
  });
}
main();
