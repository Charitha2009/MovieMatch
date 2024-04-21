// Dashboard.jsx
import React, { useState, useEffect} from 'react';
import { auth } from './firebase';
import './dashboard.css'; // Import custom CSS file
import Edit from './edit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import MovieCard from './MovieCard'; // Import the MovieCard component
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

  fetchComedyMovies = () => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Comedy'));
    getDocs(q)
      .then((querySnapshot) => {
        const comedyMovies = [];
        querySnapshot.forEach((doc) => {
          comedyMovies.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ comedyMovies });
      })
      .catch((error) => {
        console.error('Error fetching comedy movies:', error);
      });
  };


  fetchRomanticMovies = () => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Romance'));
    getDocs(q)
      .then((querySnapshot) => {
        const romanticMovies = [];
        querySnapshot.forEach((doc) => {
          romanticMovies.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ romanticMovies });
      })
      .catch((error) => {
        console.error('Error fetching romantic movies:', error);
      });
  };
  
  fetchHorrorMovies = () => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Horror'));
    getDocs(q)
      .then((querySnapshot) => {
        const horrorMovies = [];
        querySnapshot.forEach((doc) => {
          horrorMovies.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ horrorMovies });
      })
      .catch((error) => {
        console.error('Error fetching horror movies:', error);
      });
  };
  
  fetchActionMovies = () => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Action'));
    getDocs(q)
      .then((querySnapshot) => {
        const actionMovies = [];
        querySnapshot.forEach((doc) => {
          actionMovies.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ actionMovies });
      })
      .catch((error) => {
        console.error('Error fetching action movies:', error);
      });
  };
  
  fetchThrillerMovies = () => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains', 'Thriller'));
    getDocs(q)
      .then((querySnapshot) => {
        const thrillerMovies = [];
        querySnapshot.forEach((doc) => {
          thrillerMovies.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ thrillerMovies });
      })
      .catch((error) => {
        console.error('Error fetching action movies:', error);
      });
  };
  
  getPosterPath = (movieId) => {
    const q = query(collection(firestore, 'Collections'), where('movieId', '==', movieId));
    return getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const collections = querySnapshot.docs[0].data();
          const posterPath = collections.poster_path.replace(/['"]+/g, '');
          return "https://image.tmdb.org/t/p/w500" + posterPath;
        } else {
          console.log('No metadata found for movie with ID:', movieId);
          return '';
        }
      })
      .catch((error) => {
        console.error('Error fetching metadata for movie with ID:', movieId, error);
        return '';
      });
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

          {/* Comedy Movies */}
          <div className="scroll-container">
          <h2 className='genre-heading'>Comedy Movies</h2>
          <button className="scroll-button left" onClick={() => this.scrollLeft(this.firstScrollRef)}><h1>{"<"}</h1></button>
          <div className="card-grid" ref={this.firstScrollRef}>
          {/* Display comedy movies */}
          {comedyMovies.map((movie) => {
            const posterPath = this.getPosterPath(movie.id); // Get poster path
            console.log("Poster Path:", posterPath); // Log the poster path
            return (
              <MovieCard key={movie.id} movie={movie} />
            );
          })}
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
        <MovieCard key={movie.id} movie={movie} />
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
        <MovieCard key={movie.id} movie={movie} />
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
        <MovieCard key={movie.id} movie={movie} />
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
            <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <button className="scroll-button right" onClick={() => this.scrollRight(this.thirdScrollRef)}><h1>{">"}</h1></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;