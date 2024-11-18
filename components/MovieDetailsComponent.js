import { fetch } from "../services/dbProvider.js";

export const MovieDetailsComponent = {
    props: ['movieId', 'isDarkMode'],
    emits: ['showActorDetails'],
    data() {
        return {
            movie: null,
            reviews: [],
        };
    },
    async created() {
        try {
            const movieResponse = await fetch(`detail/movie/${this.movieId}`);
            this.movie = movieResponse; 
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }

        try {
            const reviewsResponse = await fetch(`search/reviews/${this.movieId}`); 
            this.reviews = reviewsResponse.items[0].items || [];  
        } catch (error) {
            console.error('Error fetching reviews data:', error);
        }
    },
    template: `
        <div :class="['container', isDarkMode ? 'text-light' : 'text-dark']">
            <div class="movie_info d-flex mb-5">
                <img
                    :src="movie.image"
                    :alt="movie.title"
                    class="img-fluid"
                    style="max-width: 300px; max-height: 500px; margin-right: 50px;"
                />
                <div :class="['movie_details', 'ml-5']">
                    <h1><strong>{{ movie.title }}</strong></h1>
                    <h4><strong>{{ movie.fullTitle }}</strong></h4>
                    <p><strong>Year: </strong>{{ movie.year }}</p>
                    <p><strong>Rating:</strong> {{ movie.ratings?.imDb || movie.ratings?.theMovieDb || 'N/A' }}</p>
                    <p class="card-text">
                        <strong>Genres: </strong>
                        <span
                            v-for="(genre, index) in movie.genreList"
                            :key="genre"
                        >
                            {{ genre.value }}<span v-if="index < movie.genreList.length - 1">, </span>
                        </span>
                    </p>
                    <p>
                        <strong>Directors: </strong>
                        <span
                            v-for="(director, index) in movie.directorList"
                            :key="director.id"
                        >
                            {{ director.name }}<span v-if="index < movie.directorList.length - 1">, </span>
                        </span>
                    </p>
                    <p><strong>Plot:</strong><span v-html="movie.plotFull || movie.plot"></span></p>
                </div>
            </div>

            <div class="actors_list mb-5">
                <h2><strong>Actors</strong></h2>
                <div class="d-flex flex-wrap gap-3">
                    <div
                        v-for="actor in movie.actorList"
                        :key="actor.id"
                        class="actor_card d-flex flex-column align-items-center"
                        @click="$emit('showActorDetails', actor.id)"
                    >
                        <img
                            :src="actor.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon'" 
                            :alt="actor.name"
                            class="img-fluid mb-2"
                            style="max-width: 100px; height: 150px;"
                        />
                        <p><strong>{{ actor.name }}</strong></p>
                    </div>
                </div>
            </div>

            <div class="reviews_list mb-5">
                <h2><strong>Reviews</strong></h2>
                <div
                    v-for="review in reviews.slice(0, 5)"
                    :key="review.id"
                    class="review_card mb-3"
                >
                    <p><strong>{{ review.username }}</strong></p>
                    <p>{{ review.content.slice(0, 800) }}<span v-if="review.content.length > 800">...</span></p>
                    <p><strong>Rate: </strong> {{ review.rate || 'N/A'}} </p>
                    <p class="text-end"><strong>Created at: </strong> {{ review.date || 'N/A' }}</p>
                </div>
            </div>
            
        </div>
    `,
};