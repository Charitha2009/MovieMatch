// Edit.jsx
import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Edit() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const fetchDataFromFirestore = async () => {
    try {
      const moviesCollection = collection(firestore, "Movies");
      const snapshot = await getDocs(moviesCollection);
      const movieList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Update each movie document to add genre_list
      for (const movie of movieList) {
        try {
          if (typeof movie.genres === "string") {
            const genresArray = JSON.parse(movie.genres.replace(/'/g, '"'));
            const genreNames = genresArray.map(genre => genre.name);
            await updateDoc(doc(moviesCollection, movie.id), {
              genre_list: genreNames
            });
            console.log("Genre list added to movie:", movie.id);
          } else {
            console.log("Genres are not a string for movie:", movie.id);
          }
        } catch (error) {
          console.error("Error updating movie document:", movie.id, error);
        }
      }
      
      console.log("Movies fetched and updated successfully:", movieList);
      setMovies(movieList);
    } catch (error) {
      console.error("Error fetching movies from Firestore:", error);
    }
  };

  return (
    <div>
      <h1>Edit Data</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
