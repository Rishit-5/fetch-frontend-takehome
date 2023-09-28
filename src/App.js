// Import necessary dependencies and components
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { ToggleButton } from "./ToggleButton"

function App() {
    // Initialize state variables
    const [data, setData] = useState([]); // Store fetched dog images
    const [breed, setBreed] = useState([]); // Store available dog breeds
    const [selectedStates, setSelectedStates] = useState(
        breed.map(() => false)
    ); // Track the selected state for each breed button
    const [breedList, setBreedList] = useState([]); // Store selected dog breeds

    // Function to toggle the selected state of a breed button
    const breedBtn = (item, index) => {
        const updatedSelectedStates = [...selectedStates];
        updatedSelectedStates[index] = !updatedSelectedStates[index];
        setSelectedStates(updatedSelectedStates);
        // adds selected breed to the list of breeds to be searched
        if (!selectedStates[index]) {
            if (!breedList.includes(item)) {
                breedList.push(item);
            }
            // removes breed if unselected
        } else {
            if (breedList.includes(item)) {
                breedList.splice(breedList.indexOf(item), 1);
            }
        }
    };

    // Fetch the list of dog breeds from an API when the component mounts, to be dynamically loaded into the
    // buttons as options
    useEffect(() => {
        fetch('https://dog.ceo/api/breeds/list')
            .then((response) => response.json())
            .then((data) => setBreed(data.message))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Function to handle the submission of selected dog breeds
    function onSub() {
        const newData = [];

        // Create an array of fetch promises for random dog images of selected breeds
        const fetchPromises = breedList.map((text) =>
            fetch('https://dog.ceo/api/breed/' + text + '/images/random/8')
                .then((response) => {
                    if (response.status === 404) {
                        console.log('Resource not found (404)');
                        return Promise.resolve({ message: [] });
                    }
                    return response.json();
                })
                .then((result) => {
                    // add selected images to array that collects the images from other breeds
                    newData.push(...result.message);
                })
                .catch((error) => console.error('Error fetching data:', error))
        );

        // Wait for all fetch promises to resolve
        Promise.all(fetchPromises)
            .then(() => {
                // Shuffle the fetched data array, otherwise they'll be sorted by breed
                shuffle(newData);
                setData(newData); // Update the data state with the shuffled array
            });
    }

    // Function to shuffle an array
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    return (
        <div>
            <h1>Dog Viewer</h1>
            <h3>Select the buttons for the breeds you want to see, then click submit to view some cute dogs!</h3>
            <div className="btn-gallery">
                {/* Render breed buttons */}
                {breed.map((item, index) => (
                    <ToggleButton
                        className="tgbtn" type="button" id="btn"
                        onPress={() => breedBtn(item, index)} key={item}
                        isSelected={selectedStates[index]}
                        onChange={() => breedBtn(item, index)}>{item}
                    </ToggleButton>
                ))}
            </div>
            <br />
            <br />
            <div className="container">
                {/* Render a submit button to fetch dog images */}
                <input type="button" id="btn" value="Submit" onClick={onSub} className="button-9"></input>
            </div>
            <br />
            <div className="image-gallery">
                {/* Render dog images */}
                {data.map((item, index) => (
                    <img
                        src={item}
                        className="img"
                        alt={`img${index}`}
                        key={index}
                        onError={(e) => {
                            console.error(`Image ${item} is invalid or doesn't work.`);
                            e.target.style.display = 'none';
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
