'use client'; // Ensure this file is client-side rendered

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type SongData = {
  lyrics: string;
  DownloadSong: string;
};

const SongsPage = () => {
  const searchParams = useSearchParams();
  const dataString = searchParams.get('data'); // Retrieve the lyrics query param
  const [data, setData] = useState<SongData | null>(null);
  
  useEffect(() => {
    if (dataString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataString));
        setData(parsedData); // Set the parsed data to state
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, [dataString]);
  
  // State to track song download status
  const [song1Downloaded, setSong1Downloaded] = useState(false);
  const [song2Downloaded, setSong2Downloaded] = useState(false);

  const handleDownloadSong = (songNumber: number) => {
    let songData: string;
    let songFileName: string;

    // Define hardcoded song data for download based on song number
    if (songNumber === 1) {
      // Sample song data for song 1 (Replace with the actual song URL)
      songData = 'https://www.rougue.com/music/sample.mp3'; // Example URL
      songFileName = 'song1_sample.mp3';
    } else if (songNumber === 2) {
      songData = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; // Example URL
      songFileName = 'song2_sample.mp3';
    } else {
      console.error('Invalid song number');
      return; // Exit if song number is not valid
    }

    console.log('Fetching song data from:', songData);

    // Fetch the song data and create a Blob for download
    fetch(songData)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch the song data');
        }
        return response.blob(); // Fetch the song data as a blob
      })
      .then((blob) => {
        console.log('Received blob:', blob);
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
  
        // Set the download link attributes
        downloadLink.href = url;
        downloadLink.download = songFileName;
  
        // Append the download link to the document and trigger a click
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
  
        // Cleanup the Blob URL
        URL.revokeObjectURL(url);
  
        // Update state to reflect that the song has been downloaded
        if (songNumber === 1) {
          setSong1Downloaded(true);
        } else if (songNumber === 2) {
          setSong2Downloaded(true);
        }
      })
      .catch((error) => {
        console.error('Error downloading the song:', error);
      });
  };
  
  const handleRefresh = () => {
    // Reset download states
    setSong1Downloaded(false);
    setSong2Downloaded(false);
    console.log('Page refreshed');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Page 2: Lyrics & Songs</h1>

      {/* Lyrics Section */}
      <div className="mb-8 w-3/4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Lyrics 1</h2>
          <p className="text-lg">{data ? data.lyrics : "Loading lyrics..."}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Lyrics 2</h2>
          <p className="text-lg">{data ? data.lyrics : "Loading lyrics..."}</p>
        </div>
      </div>

      {/* Song Section */}
      <div className="mb-8 w-3/4">
        <div className="mb-6">
          <h3 className="text-xl font-bold">Song 1</h3>
          <button
            onClick={() => handleDownloadSong(1)}
            className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow-md mb-4"
          >
            {song1Downloaded ? 'Song 1 Downloaded' : 'Download Song 1'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold">Song 2</h3>
          <button
            onClick={() => handleDownloadSong(2)}
            className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow-md mb-4"
          >
            {song2Downloaded ? 'Song 2 Downloaded' : 'Download Song 2'}
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-md mt-12"
      >
        Refresh
      </button>
    </div>
  );
};

// Wrap the page in Suspense
export default function SongsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SongsPage />
    </Suspense>
  );
}
