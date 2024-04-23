import React, { Component } from 'react';
import { getDoc, updateDoc, doc, query, collection, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import './dashboard.css'; // Import custom CSS file

class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterPath: '',
      watched: false,
      watchedButtonVisible: true
    };
  }

  async componentDidMount() {
    try {
      const { movie } = this.props;
      const userEmail = auth.currentUser.email;
      const userDocRef = doc(firestore, "users", userEmail);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData && userData.moviesWatched && userData.moviesWatched.includes(movie.id)) {
          this.setState({ watched: true });
        }
      }

      const posterPath = await this.getPosterPath(movie.id);
      this.setState({ posterPath });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getPosterPath = async (movieId) => {
    const q = query(collection(firestore, 'Collections'), where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const collections = querySnapshot.docs[0].data();
      const posterPath = collections.poster_path.replace(/['"]+/g, '');
      return "https://image.tmdb.org/t/p/w500" + posterPath;
    } else {
      return '';
    }
  };

  toggleWatched = async () => {
    const { movie } = this.props;
    const userEmail = auth.currentUser.email;
    const userDocRef = doc(firestore, "users", userEmail);

    this.setState(prevState => ({
      watched: !prevState.watched
    }), async () => {
      const newStatus = this.state.watched ? arrayUnion(movie.id) : arrayRemove(movie.id);
      await updateDoc(userDocRef, {
        moviesWatched: newStatus
      });
    });
  };

  render() {
    const { movie } = this.props;
    const { posterPath, watched } = this.state;

    return (
      <div className="movie-card">
        <img src={posterPath ? posterPath : 'https://nbcpalmsprings.com/wp-content/uploads/sites/8/2021/12/BEST-MOVIES-OF-2021.jpeg'} alt={movie.title} className='movie-image'/>
        <h3>{movie.title}</h3>
        <p>{movie.overview}</p>
        <button onClick={this.toggleWatched}>
          {watched ? 'Unwatch' : 'Mark as Watched'}
        </button>
      </div>
    );
  }
}

export default MovieCard;
