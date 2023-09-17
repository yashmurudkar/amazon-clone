import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBVNqxh-fo6vUF9Xfs0ETS_z7tT9dlZMTg",
    authDomain: "clone-344ca.firebaseapp.com",
    projectId: "clone-344ca",
    storageBucket: "clone-344ca.appspot.com",
    messagingSenderId: "889136110294",
    appId: "1:889136110294:web:a935837bd4d92c99a28777",
    measurementId: "G-WT44H1ZG5Q"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()

export { db, auth }