export const NavBarComponent = {
    props: ['isDarkMode', 'searchQuery'],
    emits: ['handleBackToHomePage', 'search'],
    data() {
        return {
            localSearchQuery: '',
            selectedSearchType: 'movie',
        };
    },
    methods: {
        submitSearch() {
            this.$emit('search', {
                searchQuery: this.localSearchQuery,
                searchType: this.selectedSearchType,
            });
        },

        handleBackToHomePage() {
            this.$emit('handleBackToHomePage');
            this.localSearchQuery = '';
            this.selectedSearchType = 'movie';
        },
    },
    watch: {
        searchQuery(newQuery) {
            this.localSearchQuery = newQuery;
        },
    },
    template: `
        <div
            class="d-flex justify-content-between align-items-center py-2 px-3 rounded"
            :style="{ backgroundColor: isDarkMode ? 'rgb(10,21,49)' : 'rgb(211,226,247)', color: isDarkMode ? 'rgb(232,235,236)' : 'rgb(1,1,2)' }"
        >
            <!-- Home Icon with click event -->
            <i 
                class="fas fa-house"
                :style="{ color: isDarkMode ? '#F0F2F5' : '', fontSize: '1.2rem', cursor: 'pointer' }"
                @click="handleBackToHomePage"
            ></i>

            <!-- Search Form -->
            <form class="d-flex" @submit.prevent="submitSearch">
                <!-- Search Type Dropdown -->
                <select
                    v-model="selectedSearchType"
                    class="form-select me-2"
                    aria-label="Select Search Type"
                >
                    <option value="movie">Movie</option>
                    <option value="name">Actor</option>
                    <option value="all">All</option>
                </select>

                <!-- Search Input with v-model binding to searchQuery -->
                <input
                    v-model="localSearchQuery"
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    :class="{
                        'bg-dark text-light dark-placeholder': isDarkMode,
                        'bg-light text-dark': !isDarkMode
                    }"
                >
                <!-- Search Button -->
                <button :class="isDarkMode ? 'btn btn-outline-success' : 'btn btn-outline-secondary'" type="submit">
                    Search
                </button>
            </form>

        </div>
    `,
};

// Add this minimal CSS to fix the placeholder color
const styles = `
.dark-placeholder::placeholder {
    color: rgba(255, 255, 255, 0.65) !important;
}
`;

// Create and append style element
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
