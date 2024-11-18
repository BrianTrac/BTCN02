export const FooterComponent = {
    props: ['isDarkMode'], 
    template: `
        <footer
            class="footer text-center py-1 rounded"
            :style="{ backgroundColor: isDarkMode ? 'rgb(41,14,15)' : 'rgb(242,218,218)', color: isDarkMode ? 'rgb(158,80,82)' : 'rgb(138,98,91)' }"
        >
            <p>&copy; 2024 Movies Info. All Rights Reserved.</p>
        </footer>
    `,
};