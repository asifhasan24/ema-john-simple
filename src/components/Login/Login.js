import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UseContext } from 'react'
import { UserContext } from '../../App';


firebase.initializeApp(firebaseConfig);
function Login() {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: ''

    })

    const [loggedInUser, setLoggedInUser] = UseContext(UserContext);



    const provider = new firebase.auth.GoogleAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const handleSignIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const { displayName, photoURL, email } = res.user
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                }
                setUser(signedInUser)

                // console.log(displayName,photoURL ,email)

            })
            .catch(err => {
                console.log(err)
                console.log(err.message)
            })

    }

    const handleFBLogin = () => {
        firebase.auth().signInWithPopup(fbProvider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
    const handleSignOut = () => {

        firebase.auth().signOut()
            .then(res => {
                const signedOutUser = {
                    isSignedIn: false,
                    name: '',
                    photo: '',
                    email: '',
                    error: '',
                    success: false

                }
                setUser(signedOutUser)
            })
            .catch(err => {
                console.log(err)
                console.log(err.message)
            })

    }

    const handleSubmit = (e) => {
        // console.log(user.email, user.password)
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    // console.log(res)
                    const newUserInfo = { ...user }
                    newUserInfo.error = ''
                    newUserInfo.success = true
                    setUser(newUserInfo)

                    updateUserName(user.name)
                })
                .catch(error => {
                    // Handle Errors here.
                    const newUserInfo = { ...user }
                    newUserInfo.error = error.message
                    newUserInfo.success = false
                    setUser(newUserInfo)
                });
        }

        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    // console.log(res)
                    const newUserInfo = { ...user }
                    newUserInfo.error = ''
                    newUserInfo.success = true
                    setUser(newUserInfo)
                    setLoggedInUser(newUserInfo)
                    console.log(res.user)

                })
                .catch(function (error) {
                    // Handle Errors here.
                    const newUserInfo = { ...user }
                    newUserInfo.error = error.message
                    newUserInfo.success = false
                    setUser(newUserInfo)
                })
        }
        e.preventDefault()

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

    const handleBlur = (e) => {
        // console.log(e.target.name,e.target.value)
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)

        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6
            const passwordHasNumber = /\d{1}/.test(e.target.value)
            isFieldValid = (isPasswordValid && passwordHasNumber)
        }
        if (isFieldValid) {
            const newUserInfo = { ...user }
            newUserInfo[e.target.name] = e.target.value
            setUser(newUserInfo)

        }
    }



    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
                    <button onClick={handleSignIn}>Sign in</button>
            }
            <br />
            <button onClick={handleFBLogin}>Sign  in Using FaceBook</button>
            {
                user.isSignedIn &&
                <div>
                    <p>Welcome  {user.name}</p>
                    <p>{user.email}</p>
                    <img src={user.photo} alt="" />
                </div>

            }


            <h1>Our own Authentication</h1>
            {/* <p>Name : {user.name} </p>
      <p>Email : {user.email} </p>
      <p>Password : {user.password}</p> */}

            <form onSubmit={handleSubmit}>
                <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
                <label htmlFor="newUser">New User Sign Up</label>
                <br />
                {newUser && <input type="text" onBlur={handleBlur} name="name" id="" placeholder="your name" />}
                <br />
                <input type="text" onBlur={handleBlur} name="email" placeholder="your email address" required />
                <br />
                <input type="password" onBlur={handleBlur} name="password" id="" placeholder="your password" required />
                <br />
                <input type="submit" value={newUser ? 'Sign Up' : 'Sign in'} />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged in'} successfully </p>
            }







        </div>
    );
}

export default Login;
