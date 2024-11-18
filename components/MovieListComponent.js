export const MovieListComponent = {
    data() {
        return {
            currentIndex: 0,
            hoveredMovie: null,
        };
    },
    props: ['movies', 'type', 'visibleCount', 'isDarkMode'],
    emits: ['showMovieDetails'],
    computed: {
        visualMovies() {
            return this.movies.slice(this.currentIndex, this.currentIndex + this.visibleCount);
        },

        canMoveNext() {
            return this.currentIndex + this.visibleCount < this.movies.length;
        },

        canMovePrev() {
            return this.currentIndex > 0;
        },
    },
    methods: {
        moveNext() {
            if (this.canMoveNext) {
                this.currentIndex += this.visibleCount;
            }
        },

        movePrev() {
            if (this.canMovePrev) {
                this.currentIndex -= this.visibleCount;
            }
        },

        hoverMovie(movieId) {
            if (this.type !== 'Top Box Office') {
                this.hoveredMovie = movieId;
            }
        },

        leaveMovie() {
            this.hoveredMovie = null;
        },

    },
    template: `
        <div
            :style="{
                marginBottom: '3rem',
                maxWidth: '100%', 
                height: type === 'Top Box Office' ? '600px' : '450px',
                position: 'relative'  /* Added position relative */
            }"
        >
            <h3
                v-if="type !== 'Top Box Office'"
                :class="isDarkMode ? 'text-light' : 'text-dark'"
            >
               <strong> {{ type }} </strong>
            </h3>     

            <div
                class="movie-slider"
                style="
                    position: relative;
                    
                    width: 100%;
                    height: 100%;  /* Added full height */
                "
            >
                <!-- Previous button -->
                <button
                    :class="['slider-arrow', 'slider-prev', 'btn', isDarkMode ? 'btn-light' : 'btn-dark']"
                    style="
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                        z-index: 10;  /* Added z-index */
                    "
                    @click="movePrev"
                    
                >
                    <i class="fas fa-chevron-left"></i>
                </button>    

                <!-- Movies Container -->
                <div
                    class="slider-wrapper d-flex justify-content-center align-items-center"
                    style="
                        position: relative;  
                        height: 100%;              
                    "
                >
                    <div
                        :style="{ 
                            display: 'flex',
                            transition: 'transform 0.5s ease-in-out',
                            height: '100%',
                            width: type === 'Top Box Office' ? '35%' : '80%',      
                            gap: '1rem',
                        }"
                    >
                        <div
                            class="movie-card"
                            :style="{
                                flex: type === 'Top Box Office' ? '0 0 100%' : '0 0 33.333%',
                                padding: '10px',
                                transition: 'transform 0.3s ease, z-index 0.3s ease',
                                height:'100%',                             
                            }"
                            v-for="movie in visualMovies"
                            :key="movie.id"
                            @mouseover="hoverMovie(movie.id)"
                            @mouseleave="leaveMovie"
                            @click="$emit('showMovieDetails', movie.id)"
                        >
                            <div
                                class="card h-100 bg-dark text-light"
                                :style="{
                                    transform: hoveredMovie === movie.id ? 'scale(1.5)' : 'scale(1)',
                                    zIndex: hoveredMovie === movie.id ? 10 : 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }"
                            >  
                                <div style="flex: 100; position: relative; overflow: hidden;">
                                    <img
                                        :src="movie.image"
                                        class="card-img-top"
                                        :alt="movie.title"
                                        style="
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            object-fit: cover;
                                        "
                                    >
                                </div>
                                <div 
                                    v-if="type !== 'Top Box Office'" 
                                    class="card-body p-2"
                                    :style="{
                                        flex: '10',
                                        minHeight: '0',
                                        display: hoveredMovie === movie.id ? 'flex' : 'none',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }"
                                >
                                    {{ movie.title }}   
                                </div>
                                
                                <!-- Text Section (Overlapping for Top Box Office) -->
                                <div
                                    v-else
                                    class="card-body p-2"
                                    :style="{
                                        position: 'absolute',
                                        top: '80%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10,
                                        color: 'blueberry',
                                        textShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)',
                                        textAlign: 'center',

                                    }"
                                >
                                    <h2 class="card-title text-nowrap">
                                        <strong>{{ movie.fullTitle }}</strong>
                                    </h2>
                                    <h3 class="card-text text-nowrap">
                                        <strong>
                                        [ 
                                        <span
                                            v-for="(genre, index) in movie.genreList"
                                            :key="genre"
                                        >
                                            {{ genre.value }}<span v-if="index < movie.genreList.length - 1">, </span>
                                        </span>
                                        ]
                                        </strong>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Next button -->
                <button
                    :class="['slider-arrow', 'slider-next', 'btn', isDarkMode ? 'btn-light' : 'btn-dark']"
                    style="
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        z-index: 10;  /* Added z-index */
                    "
                    @click="moveNext"
                    
                >
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `,
};