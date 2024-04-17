import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';
import './dashboard.css'; // Import custom CSS file

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.firstScrollRef = React.createRef();
    this.secondScrollRef = React.createRef();
  }

  handleSignOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log("User signed out successfully.");
    }).catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
  };

  scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  };

  scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: 200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        <div className="navbar-container">
          <div className="navbar-item">MovieMatch <i className="fa-solid fa-magnifying-glass"></i></div>
          <button className="signout-button" onClick={this.handleSignOut}>Sign Out</button>
        </div>

        <div className="content">
          <h2 className='genre-heading'>Welcome, {user ? user.displayName || 'User' : 'User'}!</h2>
          <div className="scroll-container">
            <h2 className='genre-heading'>Comedy Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.firstScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.firstScrollRef}>
              {/* Generate cards dynamically */}
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="movie-card">
                  <h3>Movie Title {index + 1}</h3>
                  <p>Movie Description</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.firstScrollRef)}><h1>{">"}</h1></button>
          </div>

          <div className="scroll-container">
          <h2 className='genre-heading'>Romantic Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.secondScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.secondScrollRef}>
              {/* Generate cards dynamically */}
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="movie-card">
                  <h3>Movie Title {index + 1}</h3>
                  <p>Movie Description</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.secondScrollRef)}><h1>{">"}</h1></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
