'use strict';

const content = document.getElementById('content');
const BASE_URL = 'https://api.themoviedb.org/3';

// API request options and authorization header with API key
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

// Fetch movies from the API based on the endpoint
async function fetchMovies(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return data.results;
    } catch (error) {
        content.innerHTML = `<p>Error: Movies could not be loaded</p>`;
        return [];
    }
}

// Route the path to the correct movie endpoint and fetch the corresponding movies
function router(path) {
    const endpoints = {
        '/now-playing': '/movie/now_playing',
        '/popular': '/movie/popular',
        '/top-rated': '/movie/top_rated',
        '/upcoming': '/movie/upcoming',
    };

    const endpoint = endpoints[path];
    if (endpoint) {
        renderMovies(endpoint);
    } else {
        content.innerHTML = '<p>Error: Page not found</p>';
        return [];
    }
}

// Array of nav button IDs
const pages = ['now-playing', 'popular', 'top-rated', 'upcoming'];

// Function to set the active button style based on the current page
function setActiveButton(pageId) {
    pages.forEach((id) => {
        document.getElementById(id).classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Add click event listeners to each button to handle page change
pages.forEach((page) => {
    document.getElementById(page).addEventListener('click', () => {
        setActiveButton(page);
        router(`/${page}`);
    });
});

// The default page and active button for when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    setActiveButton('now-playing');
    router('/now-playing');
});

// Render the fetched movies into HTML and display them on the page
const renderMovies = async (endpoint) => {
    const movies = await fetchMovies(endpoint);

    // Map through the array of movies and generate HTML for each movie
    const movieList = movies
        .map((movie) => {
            return `
                <article class="movie">
                    <h2>${movie.title}</h2>
                    <div class="content">
                        <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
                        <div class="text">
                            <p class="txtOverview">${movie.overview}</p>
                            <p class="txtInfo">
                                <span>Original title:</span> ${movie.original_title}    
                            </p>            
                            <p class="txtInfo">
                                <span>Release date:</span> ${movie.release_date}
                            </p>
                        </div>           
                    </div>        
                </article>
            `;
        })
        .join('');
    content.innerHTML = movieList;
};
