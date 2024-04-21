// Dashboard.jsx
import React from 'react';
import { auth } from './firebase';
import './dashboard.css'; // Import custom CSS file
import Edit from './edit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.firstScrollRef = React.createRef();
    this.secondScrollRef = React.createRef();
    this.thirdScrollRef = React.createRef();
    this.fourthScrollRef = React.createRef();
    this.fifthScrollRef = React.createRef();

    this.state = {
      comedyMovies: [],
      romanticMovies: [],
      horrorMovies: [],
      actionMovies: [],
      thrillerMovies: []
    };
  }

  componentDidMount() {
    this.fetchComedyMovies();
    this.fetchRomanticMovies();
    this.fetchHorrorMovies();
    this.fetchActionMovies();
    this.fetchThrillerMovies();
  }

  fetchComedyMovies = async () => {
    try {
      const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Comedy'));
      const querySnapshot = await getDocs(q);
      const comedyMovies = [];
      querySnapshot.forEach((doc) => {
        comedyMovies.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ comedyMovies });
    } catch (error) {
      console.error('Error fetching comedy movies:', error);
    }
  };

  fetchRomanticMovies = async () => {
    try {
      const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Romance'));
      const querySnapshot = await getDocs(q);
      const romanticMovies = [];
      querySnapshot.forEach((doc) => {
        romanticMovies.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ romanticMovies });
    } catch (error) {
      console.error('Error fetching romantic movies:', error);
    }
  };

  fetchHorrorMovies = async () => {
    try {
      const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Horror'));
      const querySnapshot = await getDocs(q);
      const horrorMovies = [];
      querySnapshot.forEach((doc) => {
        horrorMovies.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ horrorMovies });
    } catch (error) {
      console.error('Error fetching horror movies:', error);
    }
  };

  fetchActionMovies = async () => {
    try {
      const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Action'));
      const querySnapshot = await getDocs(q);
      const actionMovies = [];
      querySnapshot.forEach((doc) => {
        actionMovies.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ actionMovies });
    } catch (error) {
      console.error('Error fetching action movies:', error);
    }
  };

  fetchThrillerMovies = async () => {
    try {
      const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Thriller'));
      const querySnapshot = await getDocs(q);
      const thrillerMovies = [];
      querySnapshot.forEach((doc) => {
        thrillerMovies.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ thrillerMovies });
    } catch (error) {
      console.error('Error fetching action movies:', error);
    }
  };

  getPosterPath = async (movieId) => {
    try {
      // Query the Metadata collection for documents where movieId matches
      const q = query(collection(firestore, 'Metadata'), where('movieId', '==', movieId));
      const querySnapshot = await getDocs(q);
  
      // Check if any documents exist
      if (!querySnapshot.empty) {
        // Assuming there's only one document for each movieId
        const metadata = querySnapshot.docs[0].data();
        return "https://image.tmdb.org/t/p/original" + metadata.poster_path; // Return the poster_path
      } else {
        console.log('No metadata found for movie with ID:', movieId);
        return ''; // Return empty string if no metadata found
      }
    } catch (error) {
      console.error('Error fetching metadata for movie with ID:', movieId, error);
      return ''; // Return empty string on error
    }
  };
  

  handleSignOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log('User signed out successfully.');
    }).catch((error) => {
      // An error happened.
      console.error('Error signing out:', error);
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
    const { comedyMovies, romanticMovies, horrorMovies, actionMovies, thrillerMovies } = this.state;

    return (
      <div>
        <div className="navbar-container">
          <div className="navbar-item">MovieMatch <i className="fa-solid fa-magnifying-glass"></i></div>
          <button className="signout-button" onClick={this.handleSignOut}>Sign Out</button>
        </div>

        <div className="content">
          <h2 className='genre-heading'>Welcome, {user ? user.displayName || 'User' : 'User'}!</h2>
          <img src='https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg'></img>
          <img src='https://image.tmdb.org/t/p/w500/bqnMPsZr9vhjJIwLxc3XzHkYORM.jpg'></img>

          {/* Comedy Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Comedy Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.firstScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.firstScrollRef}>
              {/* Display comedy movies */}
              {comedyMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <img src={this.getPosterPath(movie.id)} alt={movie.title} />
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.firstScrollRef)}><h1>{">"}</h1></button>
          </div>

          {/* Romantic Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Romantic Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.secondScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.secondScrollRef}>
              {/* Display romantic movies */}
              {romanticMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.secondScrollRef)}><h1>{">"}</h1></button>
          </div>

                {/* Action Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Action Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.fourthScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.fourthScrollRef}>
              {/* Display romantic movies */}
              {actionMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.fourthScrollRef)}><h1>{">"}</h1></button>
          </div>


           {/* Thriller Movies */}
           <div className="scroll-container">
            <h2 className='genre-heading'>Thriller Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.fifthScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.fifthScrollRef}>
              {/* Display Thriller movies */}
              {thrillerMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.fifthScrollRef)}><h1>{">"}</h1></button>
          </div>

          {/* Horror Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Horror Movies</h2>
            <button className="scroll-button left" onClick={() => this.scrollLeft(this.thirdScrollRef)}><h1>{"<"}</h1></button>
            <div className="card-grid" ref={this.thirdScrollRef}>
              {/* Display horror movies */}
              {horrorMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  {/* Add more movie details here */}
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.thirdScrollRef)}><h1>{">"}</h1></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
