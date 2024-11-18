export const HeaderComponent = {
    props: ['isDarkMode'],
    emits: ['toggleDarkMode'],
    template: `
        <div 
            class="header d-flex justify-content-between py-2 px-3 rounded" 
            :style="{ backgroundColor: isDarkMode ? 'rgb(41,14,15)' : 'rgb(242,218,218)', color: isDarkMode ? 'rgb(158,80,82)' : 'rgb(138,98,91)' }"
        >
            <h3><strong> 22120120 </strong></h3>
            <h3><strong> Movies Info </strong></h3>
            <div class="d-flex align-items-center">
                <div
                    class="form-check form-switch"
                    @click="$emit('toggleDarkMode')"
                    style="cursor: pointer;"
                >
                    <i 
                        :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"
                        :style="{ color: isDarkMode ? '#FFD43B' : '', fontSize: '1.2rem'}"
                    ></i>
                    <input 
                        class="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        :checked="isDarkMode" 
                        style="cursor: pointer;"
                    />
                </div>
            </div>
        </div>
    `,
};
