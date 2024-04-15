import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';
import './dashboard.css'; // Import custom CSS file

class Dashboard extends React.Component {
  handleSignOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log("User signed out successfully.");
    }).catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        <div className="navbar-container">
          <div className="navbar-item">MovieMatch <i class="fa-solid fa-magnifying-glass"></i></div>
          <button className="signout-button" onClick={this.handleSignOut}>Sign Out</button>
        </div>

        <div className="content">
          {user ? (
            <div>
              <h2>Welcome, {user.displayName || 'User'}!</h2>
              {/* Other dashboard content */}
            </div>
          ) : (
            <div>
              <h2>Welcome, User!</h2>
              <p>Please sign in to continue.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
