import React, { useState } from 'react';
import { firestore } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

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
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </label>
            <label>
                Genres (comma-separated):
                <input type="text" value={genres} onChange={e => setGenres(e.target.value)} required />
            </label>
            <label>
                Original Language:
                <input type="text" value={originalLanguage} onChange={e => setOriginalLanguage(e.target.value)} required />
            </label>
            <label>
                Production Companies (comma-separated):
                <input type="text" value={productionCompanies} onChange={e => setProductionCompanies(e.target.value)} required />
            </label>
            <label>
                Production Countries (comma-separated):
                <input type="text" value={productionCountries} onChange={e => setProductionCountries(e.target.value)} required />
            </label>
            <label>
                Release Date:
                <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required />
            </label>
            <label>
                Runtime (minutes):
                <input type="number" value={runtime} onChange={e => setRuntime(e.target.value)} required />
            </label>
            <label>
                Vote Average:
                <input type="number" step="0.1" value={voteAverage} onChange={e => setVoteAverage(e.target.value)} required />
            </label>
            <label>
                Popularity:
                <input type="number" step="0.1" value={popularity} onChange={e => setPopularity(e.target.value)} required />
            </label>
            <button type="submit">Add Movie</button>
        </form>
    );
};

export default AddMovieForm;
