import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }

}

export const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(res => {
            const { displayName, photoURL, email } = res.user
            const signedInUser = {
                isSignedIn: true,
                name: displayName,
                email: email,
                photo: photoURL,
                success: true  
 }
            return signedInUser

            // console.log(displayName,photoURL ,email)

        })
        .catch(err => {
            console.log(err)
            console.log(err.message)
        })

}

export const handleFBSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider).then(function (result) {

        var token = result.credential.accessToken;

        var user = result.user;
        user.success = true
        return user

    }).catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;



    });
}

export const handleSignOut = () => {

    return firebase.auth().signOut()
        .then(res => {
            const signedOutUser = {
                isSignedIn: false,
                name: '',
                photo: '',
                email: '',
                error: '',
                success: false

            }
            return signedOutUser
        })
        .catch(err => {
            console.log(err)
            console.log(err.message)
        })

}

export const creteUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            // console.log(res)
            const newUserInfo = res.user
            newUserInfo.error = ''
            newUserInfo.success = true
            updateUserName(name)
            return newUserInfo
        })
        .catch(error => {
            // Handle Errors here.
            const newUserInfo = {}
            newUserInfo.error = error.message
            newUserInfo.success = false
            return newUserInfo 

        });
}

export const signInWithEmailAndPassword = (email,password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
            
            const newUserInfo = res.user
            newUserInfo.error = ''
            newUserInfo.success = true
            return newUserInfo
        })
        .catch(function (error) {
            // Handle Errors here.
            const newUserInfo = {}
            newUserInfo.error = error.message
            newUserInfo.success = false
            return newUserInfo 

        })
}

const updateUserName = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: name,
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function () {
        console.log('User name updated')
        // Update successful.
    }).catch(function (error) {
        // An error happened.
        console.log(error)
        updateUserName(user.name)
    });

}