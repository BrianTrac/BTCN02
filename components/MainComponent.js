import { MovieListComponent } from "./MovieListComponent.js";
import { MovieListSearchComponent } from "./MovieListSearchComponent.js";
import { MovieDetailsComponent } from "./MovieDetailsComponent.js";
import { ActorDetailsComponent } from "./ActorDetailsComponent.js";
import { fetch } from "../services/dbProvider.js";


export const MainComponent = {
    components: {
        MovieListComponent,
        MovieListSearchComponent,
        MovieDetailsComponent,
        ActorDetailsComponent,
    },
    props: [
        'isDarkMode',
        'searchQuery',
        'isSearching',
        'isHomePage',
        'searchType',
        'isMovieDetailsPage',
        'isActorDetailsPage',
    ],
    emits: ['handleShowMovieDetails', 'handleShowActorDetails'],
    data() {
        return {
            topBoxOfficeMovies: [],
            topRatingMovies: [],
            mostPopularMovies: [],
            selectedMovieId: null,
            selectedActorId: null,
        };
    },
    async created() {
        try {
            const topBoxOfficeResponse = await fetch('get/topboxoffice/?per_page=5&page=1');
            this.topBoxOfficeMovies = topBoxOfficeResponse.items;
    
            const topRatingResponse = await fetch('get/top50/?per_page=15&page=1');
            this.topRatingMovies = topRatingResponse.items;
    
            const mostPopularResponse = await fetch('get/mostpopular/');
            this.mostPopularMovies = mostPopularResponse.items;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        handleShowMovieDetails(movieId) {       
            this.$emit('handleShowMovieDetails');
            this.selectedMovieId = movieId;
        },

        handleShowActorDetails(actorId) {
            this.$emit('handleShowActorDetails');
            this.selectedActorId = actorId;
        },
    },
    template: `
        <div v-if="!isSearching && isHomePage">
            <MovieListComponent
                :movies="topBoxOfficeMovies"
                type="Top Box Office"
                :visibleCount="1"
                :isDarkMode="isDarkMode"
                @showMovieDetails="handleShowMovieDetails"
            />
            
            <MovieListComponent
                :movies="mostPopularMovies"
                type="Most Popular"
                :visibleCount="3"
                :isDarkMode="isDarkMode"
                @showMovieDetails="handleShowMovieDetails"
            />
                  
            <MovieListComponent
                :movies="topRatingMovies"
                type="Top Rating"
                :visibleCount="3"
                :isDarkMode="isDarkMode"
                @showMovieDetails="handleShowMovieDetails"
            />
            
        </div>
        
         <div v-else-if="isMovieDetailsPage">
            <MovieDetailsComponent
                :movieId="selectedMovieId"
                :isDarkMode="isDarkMode"
                @showActorDetails="handleShowActorDetails"
            />
        </div>

        <div v-else-if="isActorDetailsPage">
            <ActorDetailsComponent
                :actorId="selectedActorId"
                :isDarkMode="isDarkMode"
                @showMovieDetails="handleShowMovieDetails"
            />
        </div>

        <div v-else>
            <MovieListSearchComponent
                :searchType="searchType"
                :searchQuery="searchQuery"
                :isDarkMode="isDarkMode"
                @showMovieDetails="handleShowMovieDetails"
            />
        </div>
    `,
};