const API_URL = 'http://matuan.online:2422/';

export const database = {
    Movies: null, 
    Names: null,
    Reviews: null,
    Top50Movies: null,
    MostPopularMovies: null,
};


// Helper function to fetch Movies data from the API
const fetchMovies = async () => {
    try {
        const data = await get('api/Movies');
        database.Movies = data; 
        console.log('Movies data fetched successfully');
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

// Helper function to fetch Names data from the API
const fetchNames = async () => {
    try {
        const data = await get('api/Names');
        database.Names = data; 
        console.log('Names data fetched successfully');
    } catch (error) {
        console.error('Error fetching names:', error);
    }
};

// Helper function to fetch Reviews data from the API
const fetchReviews = async () => {
    try {
        const data = await get('api/Reviews');
        database.Reviews = data;
        console.log('Reviews data fetched successfully');
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Helper function to fetch Top50Movies data from the API
const fetchTop50Movies = async () => {
    try {
        const data = await get('api/Top50Movies');
        database.Top50Movies = data;
        console.log('Top50Movies data fetched successfully');
    } catch (error) {
        console.error('Error fetching Top50Movies:', error);
    }
}

// Helper function to fetch MostPopularMovies data from the API
const fetchMostPopularMovies = async () => {
    try {
        const data = await get('api/MostPopularMovies');
        database.MostPopularMovies = data;
        console.log('MostPopularMovies data fetched successfully');
    } catch (error) {
        console.error('Error fetching MostPopularMovies:', error);
    }
}

// Helper function to fetch data from the API
const get = async (url) => {
    const response = await fetch(API_URL + url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Initialize the database
export const initializeDatabase = async () => {
    try {
        await Promise.all([
            fetchMovies(),
            fetchNames(),
            fetchReviews(),
            fetchTop50Movies(),
            fetchMostPopularMovies(),
        ]);
        console.log('All data fetched successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};
