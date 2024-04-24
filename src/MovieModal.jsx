import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import { doc, updateDoc, query, collection, where, getDocs, getDoc } from 'firebase/firestore';
import './MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  const [metadata, setMetadata] = useState(null);
  const [filters, setFilters] = useState(null);
  const [collectionDetails, setCollectionDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const movieId = movie.id;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const collectionsQuery = query(collection(firestore, "Collections"), where("movieId", "==", movieId));
      const filtersQuery = query(collection(firestore, "Filters"), where("movieId", "==", movieId));
      const metadataQuery = query(collection(firestore, "Metadata"), where("movieId", "==", movieId));

      try {
        const [collectionsSnap, filtersSnap, metadataSnap] = await Promise.all([
          getDocs(collectionsQuery),
          getDocs(filtersQuery),
          getDocs(metadataQuery),
        ]);

        const collectionDetails = collectionsSnap.docs.length ? collectionsSnap.docs[0].data() : null;
        const filtersDetails = filtersSnap.docs.length ? filtersSnap.docs[0].data() : null;
        const metadataDetails = metadataSnap.docs.length ? metadataSnap.docs[0].data() : null;

        setCollectionDetails(collectionDetails);
        setFilters(filtersDetails);
        setMetadata(metadataDetails);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;
        const userDocRef = doc(firestore, "users", userEmail);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setIsAdmin(!!userData.admin);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (updatedMovieData) => {
    const movieRef = doc(firestore, "Movies", movie.id);

    try {
      await updateDoc(movieRef, updatedMovieData);
      console.log("Document successfully updated!");
      setIsEditing(false); // Reset editing state
      // TODO: Re-fetch the movie details if needed
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (!metadata && !filters && !collectionDetails) return null;

  return (


    <div className="movie-modal-backdrop" onClick={onClose}>
      <div className="movie-modal-content" onClick={e => e.stopPropagation()}>



        <button className="close-button" onClick={onClose}>X</button>
        {/* Use metadata and filters directly in your JSX */}
        <h2>{movie?.title || 'No title available'}</h2>
        <p>{metadata?.tagline}</p>
        <img 
  className="movie-modal-poster"
  src={collectionDetails?.poster_path ? `https://image.tmdb.org/t/p/w500${metadata.poster_path}` : 'default_poster.png'} 
  alt={metadata?.title} 
/>


<p className="movie-modal-overview">{metadata?.overview || 'No overview available'}</p>
        <div className="movie-modal-detail-list">
  {movie?.genre && movie.genre.length > 0 && (
    <div>
      <strong>Genres: </strong>
      <div className="detail-list">
        {movie.genre.map((genreItem, index) => (
          <span key={index} className="detail-item">{genreItem}</span>
        ))}
      </div>
    </div>
  )}
</div>

<div className="movie-modal-detail-list">
  {movie?.production_companies && movie.production_companies.length > 0 && (
    <div>
      <strong>Production Companies: </strong>
      <div className="detail-list">
        {movie.production_companies.map((company, index) => (
          <span key={index} className="detail-item">{company.name}</span>
        ))}
      </div>
    </div>
  )}
</div>

        <p>{movie?.release_date}</p>
        <p>"Ratings:"{movie?.vote_average}</p>
        <p>{filters?.adult}</p>
        <p> "Status:"{filters?.status}</p>
        
        



      </div>
    </div>
  );
};

export default MovieModal;
