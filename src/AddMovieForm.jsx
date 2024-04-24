import React, { useState } from 'react';
import { firestore } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AddMovieForm.css';
const AddMovieForm = () => {
    const [genres, setGenres] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState('');
    const [productionCompanies, setProductionCompanies] = useState('');
    const [productionCountries, setProductionCountries] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [runtime, setRuntime] = useState('');
    const [title, setTitle] = useState('');
    const [voteAverage, setVoteAverage] = useState('');
    const [popularity, setPopularity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(firestore, "Movies"), {
                genres: genres.split(',').map(genre => genre.trim()),
                original_language: originalLanguage,
                production_companies: productionCompanies.split(',').map(comp => ({ name: comp.trim() })),
                production_countries: productionCountries.split(',').map(country => country.trim()),
                release_date: releaseDate,
                runtime: parseInt(runtime),
                title,
                vote_average: parseFloat(voteAverage),
                popularity: parseFloat(popularity)
            });
            console.log("Document written with ID: ", docRef.id);

            // Reset the form fields
            setGenres('');
            setOriginalLanguage('');
            setProductionCompanies('');
            setProductionCountries('');
            setReleaseDate('');
            setRuntime('');
            setTitle('');
            setVoteAverage('');
            setPopularity('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
<div className='form-container'>
  <form onSubmit={handleSubmit} className="movie-form">
    <div className="form-group">
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="genres">Genres (comma-separated):</label>
      <input type="text" id="genres" value={genres} onChange={e => setGenres(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="originalLanguage">Original Language:</label>
      <input type="text" id="originalLanguage" value={originalLanguage} onChange={e => setOriginalLanguage(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="productionCompanies">Production Companies (comma-separated):</label>
      <input type="text" id="productionCompanies" value={productionCompanies} onChange={e => setProductionCompanies(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="productionCountries">Production Countries (comma-separated):</label>
      <input type="text" id="productionCountries" value={productionCountries} onChange={e => setProductionCountries(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="releaseDate">Release Date:</label>
      <input type="date" id="releaseDate" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="runtime">Runtime (minutes):</label>
      <input type="number" id="runtime" value={runtime} onChange={e => setRuntime(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="voteAverage">Vote Average:</label>
      <input type="number" step="0.1" id="voteAverage" value={voteAverage} onChange={e => setVoteAverage(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="popularity">Popularity:</label>
      <input type="number" step="0.1" id="popularity" value={popularity} onChange={e => setPopularity(e.target.value)} required />
    </div>
    <button type="submit">Add Movie</button>
  </form>
</div>

    );
};

export default AddMovieForm;
