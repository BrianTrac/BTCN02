import { fetch } from "../services/dbProvider.js";

export const ActorDetailsComponent = {
    props: ['actorId', 'isDarkMode'],
    emits: ['showMoviesDetails'],
    data() {
        return {
            actor: null,
            movies: [],
            moviesPerPage: 2,
            currentPage: 1,
            totalPages: 0,

        };
    },
    methods: {
        async fetchMoviesByActor(page) {
            try {
                const response = await fetch(`search/name/${this.actor.name}?per_page=${this.moviesPerPage}&page=${page}`);
                this.movies = response.items;
                this.totalPages = response.total_pages;
                this.currentPage = response.page;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    async created() {
        try {
            const actorResponse = await fetch(`detail/name/${this.actorId}`);
            this.actor = actorResponse; 
            
        } catch (error) {
            console.error('Error fetching actor data:', error);
        }        

        this.fetchMoviesByActor(this.currentPage);
    },
    computed: {
        visiblePages() {
            const range = 2; // Number of pages to show before/after the current page
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
    },
    template: `
        <div
            :class="['container', isDarkMode ? 'text-light' : 'text-dark']
        ">
            <div v-if="actor">
                <div class="actor_info d-flex mb-5">
                    <img
                        :src="actor.image"
                        :alt="actor.name"
                        class="img-fluid"
                        style="max-width: 300px; margin-right: 50px;"
                    />
                    <div :class="['actor_details', 'ml-5']">
                        <h1><strong>{{ actor.name }}</strong></h1>
                        <p><strong>Role: </strong>{{ actor.role || 'N/A' }}</strong></p>
                        <p><strong>Birth Year: </strong>{{ actor.birthYear || 'N/A' }}</p>
                        <p><strong>Death Year: </strong>{{ actor.deathYear || 'N/A' }}</p>
                        <p><strong>Awards: </strong> {{ actor.awards || 'N/A' }}</p>
                        <p><strong>Height: </strong>{{ actor.height || 'N/A'}}</p>
                        <p><strong>Summary: </strong>{{ actor.summary || 'N/A'}}</p>
                    </div>
                </div>
                <div class="movies_list mb-5">
                    <h2><strong>Movies</strong></h2>

                    <!-- Column Headers -->
                    <div
                        class="row text-center fw-bold py-2"
                    >
                        <div class="col-1"></div> <!-- Placeholder for image -->
                        <div class="col-4 text-start">Title</div>
                        <div class="col-2">Awards</div>
                        <div class="col-2">Countries</div>
                        <div class="col-2">IMDb Rating</div>
                        <div class="col-1"></div> <!-- Placeholder for button -->
                    </div>

                    <!-- Movie Rows -->
                    <div
                        v-for="movie in movies"
                        :key="movie.id"
                        class="row align-items-center py-2 border-bottom"
                    >
                        <div class="col-1 text-center">
                            <img
                                :src="movie.image"
                                :alt="movie.title"
                                class="img-fluid"
                                style="width: 40px; height: 40px;"
                                @click="$emit('showMovieDetails', movie.id)"
                            />
                        </div>
                        <div class="col-4 text-start">
                            <h4 class="mb-0"><strong>{{ movie.fullTitle }}</strong></h4>
                        </div>
                        <div class="col-2 text-center">
                            <span>{{ movie.awards || 'N/A' }}</span>
                        </div>
                        <div class="col-2 text-center">
                            <span>{{ movie.countries || 'N/A' }}</span>
                        </div>
                        <div class="col-2 text-center">
                            <span>{{ movie.ratings?.imDb || 'N/A' }}</span>
                        </div>
                        <div class="col-1 text-center">
                            <button
                                @click="$emit('showMovieDetails', movie.id)"
                                class="btn btn-primary btn-sm"
                            >
                                Details
                            </button>
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
                                @click.prevent="currentPage > 1 && fetchMoviesByActor(parseInt(currentPage, 10) - 1)"
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
                                @click.prevent="fetchMoviesByActor(page)"
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
                                @click.prevent="currentPage < totalPages && fetchMoviesByActor(parseInt(currentPage, 10) + 1)"
                                aria-label="Next"
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>
            <div v-else
                class="d-flex justify-content-center align-items-center text-warning"
                style="height: 75vh;"
            >
                <h1>Actor Info Not Found In Database</h1>
            </div>
        </div>
    `,
};