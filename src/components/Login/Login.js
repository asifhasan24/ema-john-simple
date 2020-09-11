import React, { useState } from 'react';
import { useContext } from 'react'
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFBSignIn, creteUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';


function Login() {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: ''

    })
    initializeLoginFramework()

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory()
    const location = useLocation()
    let { from } = location.state || { from: { pathname: "/" } };



    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                setUser(res)
                setLoggedInUser(res)
                history.replace(from);
            })
    }

    const signOut = () =>{
        handleSignOut()
        .then(res => {
            setUser(res)
            setLoggedInUser(res)
        })
    }

    const fbSignIn = () =>{
        handleFBSignIn()
        .then(res => {
            setUser(res)
            setLoggedInUser(res)
            history.replace(from);
        })
    }






    const handleSubmit = (e) => {
        
        if (newUser && user.email && user.password) {
           creteUserWithEmailAndPassword(user.name,user.email,user.password)
           .then (res =>{
            setUser(res)
            setLoggedInUser(res)
            history.replace(from);  
           })
        }

        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email,user.password)
            .then (res =>{
                setUser(res)
                setLoggedInUser(res)
                history.replace(from);  
               })
        }
        e.preventDefault()

    }


    const handleBlur = (e) => {
      
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
                user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
                    <button onClick={googleSignIn}>Sign in</button>
            }
            <br />
            <button onClick={fbSignIn}>Sign  in Using FaceBook</button>
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
