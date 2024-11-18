import { database } from "./database.js";


/**
 * Main function to handle data fetching based on request type and parameters.
 * @param {string} request - The request string.
 * @returns {Promise<Object>} - Resolves with the requested data or rejects with an error.
 */

function fetch(request) {
    return new Promise((resolve, reject) => {
        const { type, className, pattern, params } = parseRequest(request);
        
        switch (type) {
            case 'search':
                resolve(handleSearch(className, pattern, params));
                break;
            case 'detail':
                resolve(handleDetail(className, pattern));
                break;
            case 'get':
                resolve(handleGet(className, params));
                break;
            default:
                reject(new Error('Invalid request type'));
        }
    })
}


/**
 * Parses the request string into its components.
 * @param {string} request - The request string.
 * @returns {Object} - Parsed request details.
 */
function parseRequest(request) {
    let type, className, pattern, queryString;
    let params = {};

    if (request.includes('?')) {
        [type, queryString] = request.split('?');
        [type, className, pattern] = type.split('/');
        params = {
            ...params,
            ...Object.fromEntries(new URLSearchParams(queryString).entries())
        };
    } else {
        [type, className, pattern] = request.split('/');
    }

    // Default pagination params
    params.page = parseInt(params.page, 10) || 1;
    params.per_page = parseInt(params.per_page, 10) || 15;

    return { type, className, pattern, params };
}


/**
 * Handles search requests based on className and pattern.
 * @param {string} className - The class name (e.g., 'movie', 'name', 'reviews').
 * @param {string} pattern - The search pattern.
 * @param {Object} params - Additional parameters.
 * @returns {Object} - Search results.
 */

function handleSearch(className, pattern, params) {
    let items = [];

    switch (className) {
        case 'all':
            const movies = searchMoviesByPattern(pattern);
            const names = searchNamesByPattern(pattern);
            
            items = [...movies, ...names];
            const uniqueItems = new Map();
            items.forEach(item => uniqueItems.set(item.id, item));
            items = Array.from(uniqueItems.values());
            break;
        case 'movie':
            items = searchMoviesByPattern(pattern);
            break;
        case 'name':
            items = searchNamesByPattern(pattern);
            break;
        case 'reviews':
            items = searchReviewsByMovieId(pattern);
            break;
        default:
            throw new Error('Invalid search class');
    }
    
    // Paginate the items
    const startIndex = (params.page - 1) * params.per_page;
    const endIndex = startIndex + params.per_page;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        search: pattern,
        page: params.page,
        per_page: params.per_page,
        total: items.length,
        total_pages: Math.ceil(items.length / params.per_page),
    };
}


/**
 * Handles detail requests.
 * @param {string} className - The class name (e.g., 'movie', 'name').
 * @param {string} pattern - The unique identifier.
 * @returns {Object|null} - Detailed item or null if not found.
 */

function handleDetail(className, pattern) {
    if (className === 'movie') {
      return database.Movies.find(movie => movie.id === pattern) || null;
    } else if (className === 'name') {
      return database.Names.find(person => person.id === pattern) || null;
    }
    return null;
}


/**
 * Handles 'get' requests to retrieve specific collections.
 * @param {string} className - The collection name.
 * @param {Object} params - Pagination parameters.
 * @returns {Object} - Retrieved items.
 */

function handleGet(className, params) {
    let items = [];

    switch (className) {
      case 'top50':
        items = database.Top50Movies;
        break;
      case 'mostpopular':
        items = database.MostPopularMovies;
        break;
      case 'topboxoffice':
        items = getTopBoxOfficeMovies();
        break;
      default:
        throw new Error('Invalid class name for "get" request');
    }
    
    // Paginate the items
    const startIndex = (params.page - 1) * params.per_page;
    const endIndex = startIndex + params.per_page;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      page: params.page,
      per_page: params.per_page,
      total: items.length,
      total_pages: Math.ceil(items.length / params.per_page),
    };
}


/**
 * Searches names by matching actors in movies.
 * @param {string} pattern - The search pattern.
 * @returns {Array} - Movies with matching actor names.
 */
function searchNamesByPattern(pattern) {
    const lowerPattern = pattern.toLowerCase();
    return database.Movies.filter(movie =>
      movie.actorList.some(actor => actor.name.toLowerCase().includes(lowerPattern))
    );
}

/**
 * Searches movies by matching movie name
 * @param {string} pattern - The search pattern.
 * @returns {Array} - Movies with matching movie names. 
 */

function searchMoviesByPattern(pattern) {
    const lowerPattern = pattern.toLowerCase();
    const uniqueMovies = new Map();
    
    database.Movies.forEach(movie => {
        if (movie.title.toLowerCase().includes(lowerPattern)) {
            uniqueMovies.set(movie.id, movie);
        }
    });

    return Array.from(uniqueMovies.values());
};

/**
 * Searches reviews by movie ID.
 * @param {string} movieId - The movie ID.
 * @returns {Array} - Reviews for the movie.
 */

function searchReviewsByMovieId(movieId) {
    return database.Reviews.filter(review => review.movieId === movieId);
}


/**
 * Retrieves the top box office movies based on cumulative gross.
 * @returns {Array} - Top box office movies.
 */
function getTopBoxOfficeMovies() {
    if (!database.Movies || database.Movies.length === 0) {
        console.error("Movies data is not available or empty.");
        return [];
    }
    return [...database.Movies]
        .sort((a, b) => {
            parseGross(b.boxOffice?.cumulativeWorldwideGross || 0) - parseGross(a.boxOffice?.cumulativeWorldwideGross || 0)
        });
}


/**
 * Parses a cumulative worldwide gross string to a number.
 * @param {string} gross - The gross string.
 * @returns {number} - Parsed gross amount.
 */
function parseGross(gross) {
    if (typeof gross !== 'string') {
        // Handle null, undefined, or unexpected types gracefully
        gross = gross ? String(gross) : '';
    }
    const cleanGross = gross.replace(/\D/g, ''); // Remove non-numeric characters
    return cleanGross ? parseInt(cleanGross, 10) : 0;
}

  

export { fetch };