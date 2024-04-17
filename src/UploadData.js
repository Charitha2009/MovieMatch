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
                const { adult, 
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
                    vote_count} = row;
              
            const movieRef = await addDoc(collection(firestore, "Movies"), {
                genres,
                original_language,
                production_companies,
                production_countries,
                release_date,
                runtime: parseInt(runtime),
                title,
                vote_average,
                popularity
            });

            const movieId = movieRef.id;
            
            console.log("Row uploaded to Movies collection:", row);
            
            const collectionData = {};
            if (belongs_to_collection) {
                const pairs = belongs_to_collection.split(',');
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
            
            
            console.log("Row uploaded to Movies collection:", row);
           
            await addDoc(collection(firestore, "Metadata"), {
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
            });
            
            console.log("Row uploaded to metadata collection:", row);
            await addDoc(collection(firestore, "Filters"), {
                movieId,
                adult,
                status,
                video
            });
            
            console.log("Row uploaded to filters collection:", row);

              console.log("Row uploaded to Movies collection:", row);
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