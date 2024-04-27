import React, { useState } from "react";
import Papa from 'papaparse';
import { firestore } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function UploadData() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleParse = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target.result;
      Papa.parse(csvData, {
        header: true,
        complete: async (results) => {
          setParsedData(results.data);
          console.log(results.data);
          for (const row of results.data) {
            console.log(row);
            try {
                const { 
                    adult, 
                    belongs_to_collection,
                    budget,
                    genres,
                    homepage,
                    id,
                    imdb_id,
                    original_language,
                    original_title,
                    overview,
                    popularity,
                    poster_path,
                    production_companies,
                    production_countries,
                    release_date,
                    revenue,
                    runtime,
                    spoken_languages,
                    status,
                    tagline,
                    title,
                    video,  
                    vote_average,
                    vote_count
                } = row;

                // Check if production_companies field exists
                const parsedProductionCompanies = production_companies ? production_companies.split(",") : [];

                const parsedOriginalLanguage = original_language || 'Unknown';

                const movieData = {
                    genres: genres.split(","),
                    original_language: parsedOriginalLanguage,
                    production_companies: parsedProductionCompanies,
                    production_countries: production_countries.split(","),
                    release_date,
                    runtime: parseInt(runtime) || 0,
                    title,
                    vote_average,
                    popularity
                };

                const movieRef = await addDoc(collection(firestore, "Movies"), movieData);
                const movieId = movieRef.id;

                console.log("Row uploaded to Movies collection:", row);

                if (belongs_to_collection) {
                    const pairs = belongs_to_collection.split(',');
                    const collectionData = {};
                    pairs.forEach(pair => {
                        const [key, value] = pair.split(':');
                        const processedKey = key.replace(/'/g, '').trim();
                        const processedValue = value.trim();
                        collectionData[processedKey] = processedValue;
                    });
                    await addDoc(collection(firestore, "Collections"), {
                        ...collectionData,
                        movieId
                    });
                }

                console.log("Row uploaded to Collections collection:", row);

                const metadataData = {
                    movieId,
                    budget,
                    homepage,
                    imdb_id,
                    original_title,
                    overview,
                    poster_path,
                    revenue,
                    tagline,
                    vote_count,
                    spoken_languages
                };
                await addDoc(collection(firestore, "Metadata"), metadataData);

                console.log("Row uploaded to Metadata collection:", row);

                const filtersData = {
                    movieId,
                    adult,
                    status,
                    video
                };
                await addDoc(collection(firestore, "Filters"), filtersData);

                console.log("Row uploaded to Filters collection:", row);
            } catch (error) {
                console.error("Error uploading row to Firestore collections:", error);
            }
          }
          console.log("Data upload to Firestore collections complete!");
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        }
      });
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <h1>Upload Data</h1>
      <input type="file" onChange={handleUpload} />
      <button onClick={handleParse}>Upload Data</button>
      {/* Conditionally render parsed data here */}
    </div>
  );
}
