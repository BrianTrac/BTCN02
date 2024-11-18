import { fetch } from "../services/dbProvider.js";

export const MovieListSearchComponent = {
    props: [
        'searchType',
        'searchQuery',
        'isDarkMode',
    ],
    data() {
        return {   
            currentPage: 1,
            totalPages: 0,
            moviesPerPage: 12,
            movies: [],
            loading: true,
        };
    },
    emits: ['showMovieDetails'],
    methods: {
        async fetchMovies(page) {
            try {
                const response = await fetch(`search/${this.searchType}/${this.searchQuery}?per_page=${this.moviesPerPage}&page=${page}`);
                this.movies = response.items;
                this.totalPages = response.total_pages;
                this.currentPage = response.page;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            }
        },
    },
    computed: {
        visiblePages() {
            const range = 3; // Number of pages to show before/after the current page
            const pages = [];

            if (this.totalPages <= (range * 2 + 1)) {
                for (let i = 1; i <= this.totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);

                if (this.currentPage > range + 2) {
                    pages.push('...');
                }

                for (let i = Math.max(2, this.currentPage - range); i <= Math.min(this.totalPages - 1, this.currentPage + range); i++) {
                    pages.push(i);
                }

                if (this.currentPage < this.totalPages - range - 1) {
                    pages.push('...');
                }

                pages.push(this.totalPages);
            }

            return pages;
        },

        // Combine searchQuery and searchType into a single object
        combinedSearch() {
            return {
                searchQuery: this.searchQuery,
                searchType: this.searchType,
            };
        },

    },
    mounted() {
        this.fetchMovies(this.currentPage);
    },
    watch: {
        // Watch both searchQuery and searchType as a combined dependency
        combinedSearch: {
            handler(newSearch, oldSearch) {
                if (
                    newSearch.searchQuery !== oldSearch.searchQuery ||
                    newSearch.searchType !== oldSearch.searchType
                ) {
                    this.currentPage = 1;
                    this.fetchMovies(this.currentPage);
                }
            },
            deep: true, // To enable deep watching of object properties
        },
    },
    template: `
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 75vh;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div
            v-else-if="movies.length > 0"
        >
            <div
                class="d-flex flex-wrap justify-content-center"
            >
                <div
                    v-for="movie in movies"
                    :key="movie.id"
                    class="card m-2 text-center"
                    style="width: 18rem;"
                    @click="$emit('showMovieDetails', movie.id)"
                >
                    <img
                        :src="movie.image"
                        class="card-img-top"
                        alt="Image Not Found"
                        :style="{ minHeight: '50px' }"
                    >
                    <div class="card-body">
                        <h5 class="card-title"><strong>{{ movie.fullTitle }}</strong></h5>
                        <span class="card-text">
                            [ 
                            <span
                                v-for="(genre, index) in movie.genreList"
                                :key="genre"
                            >
                                {{ genre.value }}<span v-if="index < movie.genreList.length - 1">, </span>
                            </span>
                            ]
                        </span>
                        <p class="card-text">
                            [
                            <span
                                v-for="(actor, index) in movie.actorList.slice(0, 3)" 
                                :key="actor.name"
                            >
                                {{ actor.name }}<span v-if="index < 3">, </span>
                            </span>
                            <span v-if="movie.actorList.length > 3">...</span>
                            ]
                        </p>
                    </div>
                </div>
            </div>
            <nav aria-label="page-navigation">
                <ul class="pagination justify-content-center">
                    <!-- Previous Page Button -->
                    <li
                        class="page-item"
                        :class="{disabled: currentPage === 1}"
                    >
                        <a
                            class="page-link" href="#"
                            @click.prevent="currentPage > 1 && fetchMovies(parseInt(currentPage, 10) - 1)"
                            aria-label="Previous"
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    
                    <!-- Page Number Buttons -->
                    <li
                        v-for="page in visiblePages"
                        :key="page"
                        class="page-item"
                        :class="{active: page === currentPage, disabled: page === '...'}"
                    >
                        <a
                            class="page-link" href="#"
                            @click.prevent="fetchMovies(page)"
                            :aria-current="page === currentPage ? 'page' : null"
                        >
                            {{ page }}
                        </a>
                    </li>

                    <!-- Next Page Button -->
                    <li
                        class="page-item"
                        :class="{disabled: currentPage === totalPages}"
                    >
                        <a
                            class="page-link" href="#"
                            @click.prevent="currentPage < totalPages && fetchMovies(parseInt(currentPage, 10) + 1)"
                            aria-label="Next"
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        
        <div
            v-else
            class="d-flex justify-content-center align-items-center text-warning"
            style="height: 75vh;"
        >
            <h1>No movies found for '{{ searchQuery }}'</h1>
        </div>
    `,
}