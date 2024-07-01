const apiKey = 'eb508e4e8fbfa05f479610805778965f';
const apiUrl = 'https://api.themoviedb.org/3';
let currentPage = 1;
let currentQuery = '';

// Function to fetch movies from TMDB API based on search query and page number
async function fetchMovies(query, page) {
    try {
        const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return null;
    }
}

// Function to display movies on the page
function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300';
        
        movieEl.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Released: ${movie.release_date}</p>
                <p>Rating: ${movie.vote_average}</p>
            </div>
        `;

        movieList.appendChild(movieEl);
    });
}

// Function to handle pagination
function setupPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchAndDisplayMovies(currentQuery, currentPage);
        });
        pagination.appendChild(pageButton);
    }
}

// Function to fetch and display movies based on search query and page
async function fetchAndDisplayMovies(query, page) {
    currentQuery = query;
    const data = await fetchMovies(query, page);

    if (data && data.results) {
        displayMovies(data.results);
        setupPagination(data.total_pages);
    } else {
        const movieList = document.getElementById('movieList');
        movieList.innerHTML = '<p>No movies found.</p>';
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
    }
}

// Function to handle search input
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    currentPage = 1;
    fetchAndDisplayMovies(searchInput.value, currentPage);
});

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayMovies('', currentPage);
});