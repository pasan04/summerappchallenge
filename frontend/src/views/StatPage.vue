<template>
    <div class="rvt-layout">
        <HeaderComponent/>
        <main id="main-content" class="rvt-layout__wrapper main-content">
            <div class="rvt-flex rvt-justify-center">
                <p class="rvt-ts-xl rvt-flex-xl-up">OSoMe Tweets</p>
            </div>
            <div class="rvt-stat-group rvt-p-all-md-lg-up">
                <a href="#" class="rvt-stat">
                    <div class="rvt-stat__content [ rvt-flow ]">
                        <div class="rvt-ts-lg">{{ formattedTotalDates }}</div>
                        <div class="rvt-stat__description">Number of Days</div>
                    </div>
                </a>
                <a href="#" class="rvt-stat">
                    <div class="rvt-stat__content [ rvt-flow ]">
                        <div class="rvt-ts-lg">{{ Math.round(average_counts) }}</div>
                        <div class="rvt-stat__description">Average Tweet Count Per Day</div>
                    </div>
                </a>
                <a href="#" class="rvt-stat">
                    <div class="rvt-stat__content [ rvt-flow ]">
                        <div class="rvt-ts-lg">{{ formattedTotalCounts }}</div>
                        <div class="rvt-stat__description">Total number of Tweets (millions)</div>
                    </div>
                </a>
                <a href="#" class="rvt-stat">
                    <div class="rvt-stat__content [ rvt-flow ]">
                        <div class="rvt-ts-lg">{{ highest_count }}</div>
                        <div class="rvt-stat__description">Highest Tweet Date</div>
                    </div>
                </a>
                <a href="#" class="rvt-stat">
                    <div class="rvt-stat__content [ rvt-flow ]">
                        <div class="rvt-ts-lg">{{ lowest_count }}</div>
                        <div class="rvt-stat__description">Lowest Tweet Date</div>
                    </div>
                </a>
            </div>
        </main>
        <FooterComponent/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { API_CALL } from '../shared/content';
import FooterComponent from "@/components/Footer.vue";
import HeaderComponent from "../components/Header.vue";
export default defineComponent({
    name: 'StatPage',
    components: {HeaderComponent, FooterComponent},
    setup() {
        const total_dates = ref<number>(0);
        const total_counts = ref<number>(0);
        const average_counts = ref<number>(0);
        const lowest_count = ref<string>('');
        const highest_count = ref<string>('');
        const username = ref<string | null>(null);

        const getStats = async () => {
            try {
                const response = await axios.get(API_CALL + '/data/getstat/');
                total_dates.value = response.data.total_dates.toString();
                total_counts.value = response.data.total_counts;
                average_counts.value = Math.round(response.data.average_counts);
                highest_count.value = response.data.highest_count.date + ': ' + response.data.highest_count.count;
                lowest_count.value = response.data.lowest_count.date + ': ' + response.data.lowest_count.count;
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchUsername = async () => {
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    throw new Error('Email is missing');
                }
                const response = await axios.get(`${API_CALL}/api/getuserbyemail/`, {
                    params: { email },
                    headers: { 'Content-Type': 'application/json' },
                });
                username.value = response.data.name;
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };
        onMounted(() => {
            getStats();
            fetchUsername();
        });

        const formattedTotalCounts = computed(() => {
            return (total_counts.value / 1000000).toFixed(2) + 'M';
        });

        const formattedTotalDates = computed(() => {
            const years = Math.floor(total_dates.value / 365);
            const days = total_dates.value % 365;
            return `${years} year${years !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
        });

        return {
            total_dates,
            total_counts,
            average_counts,
            lowest_count,
            highest_count,
            formattedTotalCounts,
            formattedTotalDates
        };
    }
});
</script>

<style scoped>
</style>
