import React, { Component } from 'react';
import { getDoc, deleteDoc, updateDoc, doc, query, collection, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import './dashboard.css'; // Import custom CSS file
import MovieModal from './MovieModal'; // Import the modal component




class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterPath: '',
      watched: false,
      watchedButtonVisible: true,
      isModalOpen: false,
      isAdmin: false, // Add isAdmin state
      isEditing: false,
      metadata: null,
      filters: null,
      collectionDetails: null,

    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.getPosterPath = this.getPosterPath.bind(this); // Binding the getPosterPath method
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.getPosterPath = this.getPosterPath.bind(this);
  }
 
  async componentDidMount() {
    try {
      const { movie } = this.props;
      const userEmail = auth.currentUser.email;
      const userDocRef = doc(firestore, "users", userEmail);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        this.setState({
          isAdmin: !!userData.admin,  // Ensure admin rights are updated based on user data
          watched: userData.moviesWatched && userData.moviesWatched.includes(movie.id)
        });
      }

      const posterPath = await this.getPosterPath(movie.id);
      this.setState({ posterPath });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getPosterPath(movieId) {
    const q = query(collection(firestore, 'Collections'), where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const collections = querySnapshot.docs[0].data();
      const posterPath = collections.poster_path.replace(/['"]+/g, '');
      return "https://image.tmdb.org/t/p/w500" + posterPath;
    } else {
      return '';
    }
  }

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
      window.location.reload();
    });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  fetchMovieDetails = async (movieId) => {
    const collectionsQuery = query(collection(firestore, "Collections"), where("movieId", "==", movieId));
    const filtersQuery = query(collection(firestore, "Filters"), where("movieId", "==", movieId));
    const metadataQuery = query(collection(firestore, "Metadata"), where("movieId", "==", movieId));

    try {
      const [collectionsSnap, filtersSnap, metadataSnap] = await Promise.all([
        getDocs(collectionsQuery),
        getDocs(filtersQuery),
        getDocs(metadataQuery),
      ]);

     
      this.setState({
        collectionDetails: collectionsSnap.docs.length ? collectionsSnap.docs[0].data() : null,
        filters: filtersSnap.docs.length ? filtersSnap.docs[0].data() : null,
        metadata: metadataSnap.docs.length ? metadataSnap.docs[0].data() : null,
      });
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };


  handleEditClick = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the movie card
    this.setState(prevState => ({
      isEditing: !prevState.isEditing
    }));
  };

  handleEditSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
  
    // Collect the form data
    const form = e.target;
    const movieId = form.id.value;  // Assume your form has an input with name 'id' containing the movie's document ID
    const updatedData = {
      title: form.title.value,
      release_date: form.release_date.value,
      vote_average: parseFloat(form.vote_average.value),
    };
  
    // Reference to the Firestore document
    const movieRef = doc(firestore, "Movies", movieId);
  
    try {
      // Update the document
      await updateDoc(movieRef, updatedData);
      console.log("Document successfully updated!");
      // this.fetchMovieDetails(movieId);
      window.location.reload();

  
      // Optionally, refresh the data in your component or handle the state update
      this.setState({ 
        isEditing: false, // Reset editing state
        metadata: { ...this.state.metadata, ...updatedData } // Update local state to reflect changes
      });
  
      this.closeModal(); // Close the modal if it's part of the component
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  deleteMovie = async (movieId) => {
    try {
      // Delete the movie document from the Movies collection
      const movieDocRef = doc(firestore, "Movies", movieId);
      await deleteDoc(movieDocRef);

      // Delete related documents from Collections, Filters, Metadata collections
      const collectionsQuery = query(collection(firestore, 'Collections'), where('movieId', '==', movieId));
      const collectionsSnapshot = await getDocs(collectionsQuery);
      collectionsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      const filtersQuery = query(collection(firestore, 'Filters'), where('movieId', '==', movieId));
      const filtersSnapshot = await getDocs(filtersQuery);
      filtersSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      const metadataQuery = query(collection(firestore, 'Metadata'), where('movieId', '==', movieId));
      const metadataSnapshot = await getDocs(metadataQuery);
      metadataSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Display success message or update UI accordingly
      console.log("Movie deleted successfully!");
      window.location.reload();

    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };
  
  

  render() {
    const { movie } = this.props;
    const { posterPath, watched, isModalOpen, isAdmin, isEditing, metadata } = this.state;
    const tagline = metadata?.tagline || '';
    const overview = metadata?.overview || '';
  
    return (
      <div className="movie-card" onClick={this.openModal}>
        <img src={posterPath ? posterPath : 'https://nbcpalmsprings.com/wp-content/uploads/sites/8/2021/12/BEST-MOVIES-OF-2021.jpeg'} alt={movie.title} className='movie-image'/>
        <h3>{movie.title}</h3>
        <p>{movie.overview}</p>
        <button onClick={this.toggleWatched}>
          {watched ? 'Unwatch' : 'Mark as Watched'}
        </button> 
        {isModalOpen && <MovieModal movie={movie} onClose={this.closeModal} />}
        
        {isAdmin && (
          <div>
            <button className="edit-button" onClick={this.handleEditClick}>
              Edit
            </button>
            <button className="delete-button" onClick={() => this.deleteMovie(movie.id)}>
              Delete
            </button>
          </div>
        )}
  
        {isEditing && (
        <div className="edit-form-modal">
        <div className="edit-form-backdrop" onClick={this.handleEditClick}>
          <div className="edit-form-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-edit-form" onClick={this.handleEditClick}>&times;</span>
            <h2>Edit Movie</h2>
                <form onSubmit={this.handleEditSubmit} className="edit-form">
                  <input type="hidden" name="id" value={this.props.movie.id} />
                  <label style={{color: 'black'}}>
                    Title:
                    <input type="text" defaultValue={this.props.movie.title} name="title" />
                  </label><br/>
                  <label style={{color: 'black'}}>
                    Release Date:
                    <input type="date" defaultValue={this.props.movie.release_date} name="release_date" />
                  </label><br/>
                  <label style={{color: 'black'}}>
                    Average Vote:
                    <input type="number" step="0.1" defaultValue={this.props.movie.vote_average} name="vote_average" />
                  </label><br/>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => this.setState({ isEditing: false })}>Cancel</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
};

export default MovieCard;