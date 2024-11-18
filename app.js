import { createApp } from 'vue';
import { HeaderComponent } from './components/HeaderComponent.js';
import { FooterComponent } from './components/FooterComponent.js';
import { NavBarComponent } from './components/NavBarComponent.js';
import { MainComponent } from './components/MainComponent.js';
import { initializeDatabase } from './services/database.js';

const app = createApp({
    components: {
        HeaderComponent,
        NavBarComponent,
        MainComponent,
        FooterComponent,
    },
    data() {
        return {
            searchQuery: "",
            searchType: "movie",
            isSearching: false,
            isHomePage: true,
            isDarkMode: false,
            isMovieDetailsPage: false,
        }
    },
    methods: {
        handleSearch({ searchQuery, searchType }) {
            this.isSearching = true;
            this.searchQuery = searchQuery;
            this.searchType = searchType;
            this.isHomePage = false;
            this.isMovieDetailsPage = false;
            this.isActorDetailsPage = false;
        },

        handleBackToHomePage() {
            this.isHomePage = true;
            this.isSearching = false;
            this.searchQuery = '';
            this.searchType = 'movie';
            this.isMovieDetailsPage = false;
            this.isActorDetailsPage = false;
        },

        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
        },

        handleShowMovieDetails() {
            this.isMovieDetailsPage = true;
            this.isSearching = false;
            this.isHomePage = false;
            this.isActorDetailsPage = false;
        },

        handleShowActorDetails() {
            this.isActorDetailsPage = true;
            this.isSearching = false;
            this.isHomePage = false;
            this.isMovieDetailsPage = false;
        }

    },
    template: `
        <div
            :style="{ backgroundColor: isDarkMode ? '#343a40' : '#f8f9fa' }"
        >
            <div
                class="container"
                style="max-width: 1200px; margin: 0 auto;"
            >
                <!-- Header -->
                <HeaderComponent
                    @toggleDarkMode="toggleDarkMode"
                    :isDarkMode="isDarkMode"
                    class="mb-2"
                />

                <!-- Navigation -->
                <NavBarComponent
                    @search="handleSearch"
                    :isDarkMode="isDarkMode"
                    @handleBackToHomePage="handleBackToHomePage"
                    :isHomePage="isHomePage"
                    class="mb-2"/
                >

                <!-- Main Content -->
                <MainComponent
                    :searchQuery="searchQuery"
                    :isSearching="isSearching"
                    :isHomePage="isHomePage"
                    :isDarkMode="isDarkMode"
                    :searchType="searchType"
                    @handleShowMovieDetails="handleShowMovieDetails"
                    :isMovieDetailsPage="isMovieDetailsPage"
                    @handleShowActorDetails="handleShowActorDetails"
                    :isActorDetailsPage="isActorDetailsPage"
                />

                <!-- Footer -->
                <FooterComponent :isDarkMode="isDarkMode" />
            </div>
        </div>
    `,
});

initializeDatabase()
    .then(() => {
        console.log('Database is ready to be used.');
        app.mount('#app');
        console.log('App is mounted.');
    })
    .catch((error) => {
        console.error('Initialization failed:', error);
});

