const apiUrl = 'https://script.google.com/macros/s/AKfycbyGdVDGESjHgCsZ552KY8q_3W37mU0R3ybAq28Veyi6kN4G6G_C_izL60jcH-kVfkG6/exec';

async function applyFilters() {
  // Get the filter values
  const stepName = document.getElementById('stepName').value;
  const style = document.getElementById('style').value;
  const country = document.getElementById('country').value;
  // Add other filters as needed

  try {
    // Fetch data from Google Sheets
    const data = await getData(); // Ensure you await the Promise

    // Filter the data based on the selected filter values
    const filteredData = data.filter(item => {
        return (stepName === '' || item.step === stepName) &&
               (style === '' || item.style === style) &&
               (country === '' || item.country === country);
        // Include additional filters as needed
    });

    // Update the gallery with the filtered data
    updateGallery(filteredData);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    // Handle errors, such as by displaying a message to the user
  }
}


function updateGallery(filteredData) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear existing content

  filteredData.forEach(item => {
    // Create a container for each item
    const container = document.createElement('div');
    container.className = 'gallery-item'; // Add a class for styling

    // Create and append the step name
    const stepName = document.createElement('p');
    stepName.textContent =  `${item.step} (${item.style})`;
    stepName.className = 'stepName'; // Add a class for styling
    container.appendChild(stepName);

    // Create and append the image
    let gifUrl = item.gifUrl;
    gifUrl = transformGoogleDriveURL(gifUrl);
    const img = document.createElement('img');
    img.src = gifUrl;
    img.alt = item.step;
    img.className = 'responsive-gif'; // Add a class for styling
    container.appendChild(img);

    // Create and append info about step (src of the gif and tutorial links)
    const info = document.createElement('p');
    info.className = 'info'; // Add a class for styling

    // Check if gifSrc value is not empty
    if (item.gifSrc) {
        // Create link for gifSrc
        const gifSrcLink = document.createElement('a');
        gifSrcLink.href = item.gifSrc; // Set link URL
        gifSrcLink.textContent = 'src'; // Set link text
        gifSrcLink.target = '_blank'; // Open in a new tab
        info.appendChild(gifSrcLink);
        info.appendChild(document.createTextNode('   ')); // Add space
    }

    // Check if tutorial value is not empty
    if (item.tutorial) {
        // Create link for tutorial
        const tutorialLink = document.createElement('a');
        tutorialLink.href = item.tutorial; // Set link URL
        tutorialLink.textContent = 'tutorial'; // Set link text
        tutorialLink.target = '_blank'; // Open in a new tab
        info.appendChild(tutorialLink);
        info.appendChild(document.createTextNode('   ')); // Add space
    }

    // Check if song value is not empty
    if (item.song) {
      // Create link for tutorial
      const songLink = document.createElement('a');
      songLink.href = item.song; // Set link URL
      songLink.textContent = 'song'; // Set link text
      songLink.target = '_blank'; // Open in a new tab
      info.appendChild(songLink);
      info.appendChild(document.createTextNode('   ')); // Add space
    }

    // Check if creator value is not empty
    if (item.creator) {
      // Create link for creator
      const creatorLink = document.createElement('a');
      creatorLink.href = item.creator; // Set link URL
      creatorLink.textContent = 'creator'; // Set link text
      creatorLink.target = '_blank'; // Open in a new tab
      info.appendChild(creatorLink);
      info.appendChild(document.createTextNode('   ')); // Add space
    }

    container.appendChild(info);


    // Append the container to the gallery
    gallery.appendChild(container);
  });
}




// for debugging
function dispData(){
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Process and display your data here
    })
    .catch(error => console.error('Error Code Karin:', error));

}


function getData(){
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => console.error('Error K:', error));
}

async function populateMenuOptions() {
  try {
    const data = await getData(); // Wait for data to be fetched

    // Extract and sort unique countries
    const countries = data.map(item => item.country)
                          .filter((value, index, self) => value && self.indexOf(value) === index)
                          .sort();

    // Populate the 'country' dropdown
    const countrySelect = document.getElementById('country');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = option.textContent = country;
        countrySelect.appendChild(option);
    });

    // Extract and sort unique styles
    const styles = data.map(item => item.style)
                       .filter((value, index, self) => value && self.indexOf(value) === index)
                       .sort();

    // Populate the 'style' dropdown
    const styleSelect = document.getElementById('style');
    styles.forEach(style => {
        const option = document.createElement('option');
        option.value = option.textContent = style;
        styleSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

function transformGoogleDriveURL(url) {
  const baseUrl = "https://drive.google.com/thumbnail?id=";
  const match = url.match(/export=view&id=([a-zA-Z0-9_-]+)/); //originalUrl = "http://drive.google.com/uc?export=view&id=11eSwhsuU-bFs8at5whcIx93KRzk8AjSI";

  if (match && match[1]) {
      url = baseUrl + match[1];
  } else {
      // Return original URL if no ID is found or the format is incorrect
      return url;
  }
  return url
}

// Example usage
//const originalUrl = "http://drive.google.com/uc?export=view&id=11eSwhsuU-bFs8at5whcIx93KRzk8AjSI";
//const transformedUrl = transformGoogleDriveURL(originalUrl);
//console.log(transformedUrl);


// Call this function when the page loads
populateMenuOptions();
applyFilters();
//dispData();