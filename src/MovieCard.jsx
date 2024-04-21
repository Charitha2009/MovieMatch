import React, { Component } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import './dashboard.css'; // Import custom CSS file
class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterPath: ''
    };
  }

  async componentDidMount() {
    try {
      const posterPath = await this.getPosterPath(this.props.movie.id);
      this.setState({ posterPath });
    } catch (error) {
      console.error('Error fetching poster path:', error);
    }
  }

  getPosterPath = async (movieId) => {
    try {
      const q = query(collection(firestore, 'Collections'), where('movieId', '==', movieId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const collections = querySnapshot.docs[0].data();
        const posterPath = collections.poster_path.replace(/['"]+/g, '');
        return "https://image.tmdb.org/t/p/w500" + posterPath;
      } else {
        console.log('No metadata found for movie with ID:', movieId);
        return '';
      }
    } catch (error) {
      console.error('Error fetching metadata for movie with ID:', movieId, error);
      return '';
    }
  };

  render() {
    const { movie } = this.props;
    const { posterPath } = this.state;

    return (
      <div className="movie-card">
      <img src={posterPath ? posterPath : 'https://nbcpalmsprings.com/wp-content/uploads/sites/8/2021/12/BEST-MOVIES-OF-2021.jpeg'} alt={<img src = 'https://nbcpalmsprings.com/wp-content/uploads/sites/8/2021/12/BEST-MOVIES-OF-2021.jpeg' ></img>} className='movie-image'/>
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      {/* Add more movie details here */}
    </div>
    

    

    );
  }
}

export default MovieCard;
