import React from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth, firestore } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import "./home.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Dashboard from './dashboard';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import UploadData from './UploadData';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error: null,
      redirectToDashboard: false // Add state to handle redirection

    };
  }


  componentDidMount() {
    // Listen for authentication state changes
    auth.onAuthStateChanged(user => {
      if (user) {
        // If user is signed in, update state and set redirectToDashboard to true
        this.setState({ user, redirectToDashboard: true });
      } else {
        // If user is signed out, update state and set redirectToDashboard to false
        this.setState({ user: null, redirectToDashboard: false });
      }
    });
  }

  handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google using Firebase Authentication
      const result = await signInWithPopup(auth, provider);
    
      // Access user information
      const user = result.user;
      const { displayName, email, uid } = user;
  
      // Check if the user already exists in Firestore
      const userDoc = await getDoc(doc(firestore, "users", email));
      if (userDoc.exists()) {
        console.log("User already exists in Firestore");
        return; // Exit the function if user already exists
      }
  
  
      // Save user details to Firestore collection with email as document ID
      await setDoc(doc(firestore, "users", email), { displayName, email, uid, admin: false });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    // If redirectToDashboard is true, redirect user to the dashboard page
    if (this.state.redirectToDashboard) {
      return <Dashboard  user={this.state.user} />;
    }

    return (
      <div className="container">
        <div className="left-half"></div>
        <div className="right-half">
          <div className="login-card">
            <div className='card-content'>
            <h1>MOVIE MATCH <i class="fa-solid fa-magnifying-glass"></i></h1>

            <br></br>
            <p>Welcome to the world of movies! </p>
            <p>Explore and connect with your perfect movie selections, elevating your movie-watching journey.</p>
            </div>
            {this.state.user ? (
              <div>
                <p>Welcome, {this.state.user.displayName || 'User'}!</p>
                <button onClick={() => auth.signOut()}>Sign out</button>
              </div>
            ) : (
              <div className='card-content'>
                <p></p>
                <br></br>
                <p>Sign in now to unlock a personalized experience.</p>
                <button onClick={this.handleGoogleLogin} className="login-button">
                  <img src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' className='google-icon' alt="Google Logo"></img> 
                  <span className="button-text">Sign in with Google</span>
                </button>
                {this.state.error && <p>{this.state.error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
