<template>
    <div class="rvt-layout">
        <HeaderComponent />
        <main id="main-content" class="rvt-layout__wrapper rvt-layout__wrapper--single rvt-container-sm">
            <div class="rvt-row rvt-m-top-sm">
                <div class="rvt-cols-4">
                    <label for="select-input-default" class="rvt-label">Select year</label>
                    <select id="select-input-default" class="rvt-select" v-model="selectedYear">
                        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>
            </div>

            <table class="rvt-table-cells rvt-m-bottom-3-xl rvt-m-top-sm">
                <caption class="rvt-sr-only">Striped table</caption>
                <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Tweet Count</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data, index) in fileData" :key="index">
                    <td>{{ data.date }}</td>
                    <td>{{ data.count }}</td>
                </tr>
                </tbody>
            </table>
        </main>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';

export default defineComponent({
    name: 'HomeView',
    components: { HeaderComponent, FooterComponent },
    setup() {
        const years = ref<string[]>([]);
        const selectedYear = ref<string>(''); // Initialize selectedYear with a default value or leave it empty
        const fileData = ref<any[]>([]); // Adjusted type to any[] to store objects

        const fetchYears = async () => {
            try {
                const response = await axios.get<string[]>('http://localhost:8000/data/folders/', {
                    headers: {
                        Authorization: `Bearer your_access_token_here`, // Replace with your actual access token
                    },
                });
                years.value = response.data;
                if (years.value.length > 0) {
                    selectedYear.value = years.value[0]; // Set the first year as the default selected year
                }
            } catch (error) {
                console.error('Failed to fetch years:', error);
            }
        };

        const readFile = async (yearPassed: string) => {
            try {
                const response = await axios.post<any[]>('http://localhost:8000/data/readfile/',  {
                    year: yearPassed
                }, {
                    headers: {
                        Authorization: `Bearer your_access_token_here`, // Replace with your actual access token
                    },
                });
                fileData.value = response.data;
            } catch (error) {
                console.error('Failed to read file:', error);
            }
        };

        watch(selectedYear, async (newValue) => {
            await readFile(newValue);
        });

        onMounted(() => {
            fetchYears();
        });

        return {
            years,
            selectedYear,
            fileData,
        };
    },
});
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
