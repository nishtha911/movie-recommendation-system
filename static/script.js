const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const autocompleteList = document.getElementById('autocomplete-list');
const loadingEl = document.getElementById('loading');
const resultsSection = document.getElementById('results-section');
const movieGrid = document.getElementById('movie-grid');
const searchedMovieEl = document.getElementById('searched-movie');

let allMovies = [];

// Fetch movies for autocomplete
fetch('/api/movies')
    .then(res => res.json())
    .then(data => {
        allMovies = data.map(String);
    })
    .catch(err => console.error("Error loading movies list:", err));

// Autocomplete Logic
searchInput.addEventListener('input', function() {
    const val = this.value.trim().toLowerCase();
    autocompleteList.innerHTML = '';
    if (!val) {
        autocompleteList.style.display = 'none';
        return;
    }

    const matches = allMovies.filter(movie => movie.toLowerCase().includes(val)).slice(0, 10);
    
    if (matches.length > 0) {
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            // Highlight matching part (simplified)
            const lowerMatch = match.toLowerCase();
            const matchIndex = lowerMatch.indexOf(val);
            
            div.innerHTML = match; // fallback
            if(matchIndex !== -1) {
                div.innerHTML = match.substring(0, matchIndex) + 
                                '<strong>' + match.substring(matchIndex, matchIndex + val.length) + '</strong>' + 
                                match.substring(matchIndex + val.length);
            }
            
            div.addEventListener('click', () => {
                searchInput.value = match;
                autocompleteList.style.display = 'none';
                fetchRecommendations(match);
            });
            autocompleteList.appendChild(div);
        });
        autocompleteList.style.display = 'block';
    } else {
        autocompleteList.style.display = 'none';
    }
});

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) {
        autocompleteList.style.display = 'none';
    }
});

// Search button click
searchBtn.addEventListener('click', () => {
    const val = searchInput.value.trim();
    if (val) fetchRecommendations(val);
});

// Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim();
        if (val) {
            autocompleteList.style.display = 'none';
            fetchRecommendations(val);
        }
    }
});

function fetchRecommendations(movie) {
    // Show loading, hide old results
    loadingEl.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    movieGrid.innerHTML = '';

    fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie: movie })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error) });
        }
        return res.json();
    })
    .then(data => {
        loadingEl.classList.add('hidden');
        searchedMovieEl.textContent = data.search_term;
        renderMovies(data.recommendations);
        resultsSection.classList.remove('hidden');
    })
    .catch(err => {
        loadingEl.classList.add('hidden');
        alert(err.message || "An error occurred fetching recommendations.");
    });
}

function renderMovies(movies) {
    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        // Staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            ${movie.vote_average > 0 ? '<div class="badge-rating">⭐ ' + movie.vote_average + '</div>' : ''}
            <h3 class="card-title">${movie.title}</h3>
            <div class="card-meta">
                <div class="meta-item">
                    <span class="meta-label">Genres:</span>
                    <span>${movie.genres}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Director:</span>
                    <span>${movie.director}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Released:</span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}
