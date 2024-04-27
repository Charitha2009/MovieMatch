import React, { Component } from 'react';

import { auth, firestore } from './firebase';
import './dashboard.css'; // Import custom CSS file
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import MovieCard from './MovieCard'; // Import the MovieCard component
import AddMovieForm from './AddMovieForm';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comedyMovies: [],
      romanticMovies: [],
      horrorMovies: [],
      actionMovies: [],
      thrillerMovies: [],
      watchedMovies: [],
      suggestedMovies: [],
      showForm: false,
      showStats: false,
      genreCounts: {},
    };

    this.firstScrollRef = React.createRef();
    this.secondScrollRef = React.createRef();
    this.thirdScrollRef = React.createRef();
    this.fourthScrollRef = React.createRef();
    this.fifthScrollRef = React.createRef();
    this.sixthScrollRef = React.createRef();
  }

  componentDidMount() {
    this.fetchComedyMovies();
    this.fetchRomanticMovies();
    this.fetchHorrorMovies();
    this.fetchActionMovies();
    this.fetchThrillerMovies();
    this.fetchGenreMovies();
    this.fetchWatchedMovies();
  }

  fetchGenreMovies = () => {
    this.fetchComedyMovies();
    this.fetchRomanticMovies();
    this.fetchHorrorMovies();
    this.fetchActionMovies();
    this.fetchThrillerMovies();
  }

  fetchWatchedMovies = async () => {
    const userEmail = auth.currentUser.email; // Assuming currentUser is not null
    const userDocRef = doc(firestore, "users", userEmail);

    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const movieIds = userData.moviesWatched;
    
        if (movieIds && movieIds.length > 0) {
          const watchedMovies = await Promise.all(movieIds.map(async (movieId) => {
            const movieRef = doc(firestore, "Movies", movieId);
            const movieSnapshot = await getDoc(movieRef);
            if (movieSnapshot.exists()) {
              return { id: movieSnapshot.id, ...movieSnapshot.data() };
            }
            return null;
          }));
    
          const validWatchedMovies = watchedMovies.filter(movie => movie !== null);
          const watchedGenres = [...new Set(validWatchedMovies.flatMap(movie => movie.genre_list))];

          this.setState({ watchedMovies: validWatchedMovies }, this.calculateGenreCounts, this.fetchSuggestedMovies(watchedGenres));
        } else {
          this.setState({ watchedMovies: [], suggestedMovies: [] });
        }
      } else {
        console.error("User document does not exist");
        this.setState({ watchedMovies: [], suggestedMovies: [] });
      }
    } catch (error) {
      console.error('Error fetching watched movies:', error);
    }
  };

  fetchSuggestedMovies = (watchedGenres) => {
    const q = query(collection(firestore, 'Movies'), where('genre_list', 'array-contains-any', watchedGenres));
    getDocs(q).then((querySnapshot) => {
      const suggestedMovies = [];
      querySnapshot.forEach((doc) => {
        if (!this.state.watchedMovies.some(watched => watched.id === doc.id)) {
          suggestedMovies.push({ id: doc.id, ...doc.data() });
        }
      });
      console.log(suggestedMovies);
      this.setState({ suggestedMovies });
    }).catch((error) => {
      console.error('Error fetching suggested movies:', error);
    });
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
  
  handleAddMovie = () => {
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  };

  handleSignOut = () => {
    auth.signOut().then(() => {
      console.log('User signed out successfully.');
    }).catch((error) => {
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


 

  // Method to handle when the Search button is clicked
  handleSearch = () => {
    // You can replace this with your logic to handle the search action
    // This might involve setting a state variable to true which conditionally renders a search bar, or redirects to a search page
    console.log('Search button clicked');
  };

  calculateGenreCounts = () => {
    // Initialize all genres with zero count
    const allGenres = { 'Horror': 0, 'Action': 0, 'Thriller': 0, 'Romantic': 0, 'Comedy': 0 };

    // Count each genre from watched movies
    const genreCounts = this.state.watchedMovies.reduce((acc, movie) => {
        movie.genre_list.forEach(genre => {
            if (acc.hasOwnProperty(genre)) {
                acc[genre] += 1;
            }
        });
        return acc;
    }, {...allGenres});  // Spread to ensure mutation does not occur

    // Set the counts directly to state (not percentages)
    this.setState({ genreCounts });
};


renderPieChart = () => {
  const { genreCounts } = this.state;
  const labels = Object.keys(genreCounts);
  const dataValues = Object.values(genreCounts);

  const total = dataValues.reduce((sum, current) => sum + current, 0);

  const data = {
    labels,
    datasets: [{
      data: dataValues,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    },
    title: {
      display: true,
      text: 'Genres Watched by the User', // Title here
      fontSize: 18,
      padding: {
        top: 20,
        bottom: 30 // Adjust padding as needed
      }
    }
  };
  

  return <Pie data={data} options={options} />;
};


toggleStats = () => {
  this.setState(prevState => ({
      showStats: !prevState.showStats
  }));
};



  render() {
    const { user } = this.props;
    const { comedyMovies, romanticMovies, horrorMovies, actionMovies, thrillerMovies, watchedMovies, suggestedMovies, showForm, showStats } = this.state;

    return (
      <div>
        <div className="navbar-container">
          <div className="navbar-item">MovieMatch <i className="fa-solid fa-magnifying-glass"></i></div>
        {watchedMovies.length > 0 && (<button className='navbar-button' onClick={this.toggleStats}>Show User Stats</button>)}
           
        
          {user && user.admin && (
            <button className="navbar-button" onClick={this.handleAddMovie}>Add Movie</button>
          )}
          <button className="navbar-button" onClick={this.handleSearch}><i className="fa-solid fa-magnifying-glass"></i> Search</button>
          <button className="signout-button" onClick={this.handleSignOut}>Sign Out</button>
        </div>
        {showForm && <AddMovieForm closeForm={() => this.setState({ showForm: false })} />}

        {showStats && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={this.toggleStats}>&times;</span>
              {this.renderPieChart()}
            </div>
          </div>
        )}
        <div className="content">
          <h2 className='genre-heading'>Welcome, {user ? user.displayName || 'User' : 'User'}!</h2>

          {/* Suggested Movies */}
          {watchedMovies.length > 0 && (
            <div className="scroll-container">
              <h2 className='genre-heading'>Suggested Movies</h2>
              <div className="card-grid">
                {suggestedMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} user={user} />
                ))}
              </div>
            </div>
          )}

          {/* Watched Movies */}
          {watchedMovies.length > 0 && (
            <div className="scroll-container">
              <h2 className='genre-heading'>Movies Already Watched</h2>
              <div className="card-grid" ref={this.sixthScrollRef}>
                {watchedMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} user={user} />
                ))}
              </div>
            </div>
          )}

          {/* Comedy Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Comedy Movies</h2>
            <div className="card-grid" ref={this.firstScrollRef}>
              {comedyMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          </div>

          {/* Romantic Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Romantic Movies</h2>
            <div className="card-grid" ref={this.secondScrollRef}>
              {romanticMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          </div>

          {/* Action Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Action Movies</h2>
            <div className="card-grid" ref={this.fourthScrollRef}>
              {actionMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          </div>

          {/* Thriller Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Thriller Movies</h2>
            <div className="card-grid" ref={this.fifthScrollRef}>
              {thrillerMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          </div>

          {/* Horror Movies */}
          <div className="scroll-container">
            <h2 className='genre-heading'>Horror Movies</h2>
            <div className="card-grid" ref={this.thirdScrollRef}>
              {horrorMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}


}

export default Dashboard;
