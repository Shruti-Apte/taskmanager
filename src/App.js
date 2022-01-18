import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';
import TaskManager from './Components/TaskManager';
import {  createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from "firebase/auth";
import {auth,db} from './firebase';
import Login from './Components/Login';
import { collection, doc,setDoc } from "firebase/firestore";

function App() {

//States
const[User,setUser]=useState('');
const[Email,setEmail]=useState('');
const[Password,setPassword]=useState('');
const[EmailError,setEmailError]=useState('');
const[PasswordError,setPasswordError]=useState('');
const[hasAccount,sethasAccount]=useState('');



//functions 

const clearInputs =()=>{
  setEmail('');
  setPassword('');
}

const clearErrors =()=>{
  setEmailError('');
  setPasswordError('');
}

const handleLogin =()=>{
  clearErrors();
  signInWithEmailAndPassword(auth, Email, Password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    switch(error.code){
      case "auth/invalid-email":
      case "auth/user-disabled":
      case "auth/user-not-found":
        setEmailError(error.message);
        break;
      case "auth/wrong-password":
        setPasswordError(error.message);
        break;

    }
  });

}


const handleSignUp =()=>{
  clearErrors();
  createUserWithEmailAndPassword(auth, Email, Password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const docref = doc(db,'Users',user.uid);
    setDoc(docref,{email:Email,Password:Password});
    // ...
  })
  .catch((error) => {
    switch(error.code){
      case "auth/email-already-in-use":
      case "auth/invalid-email":
        setEmailError(error.message);
        break;
      case "auth/weak-password":
        setPasswordError(error.message);
        break;
    }
  });
} 

const handleLogout =()=>{
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

const authListener =()=>{
  
  onAuthStateChanged(auth,(user)=>{
    if (user) {
      clearInputs();
      setUser(user)
    } else {
      setUser('');
    }
  })
}


useEffect(()=>{
  authListener();
},[])

  return (
    <div>
    {User ?<TaskManager handleLogout={handleLogout} User={User}/>
    :<Login
    Email={Email}
    setEmail={setEmail}
    Password={Password}
    setPassword={setPassword}
    handleLogin={handleLogin}
    handleSignUp={handleSignUp}
    hasAccount={hasAccount}
    sethasAccount={sethasAccount}
    EmailError={EmailError}
    PasswordError={PasswordError}
    />}
    </div>
    
    
  );
}

export default App;
