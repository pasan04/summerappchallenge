<template>
<!--    <HeaderComponent />-->
    <router-view/>
<!--    <FooterComponent/>-->
</template>

<script lang="ts">
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'StatPage',
    components: {HeaderComponent, FooterComponent},

});
</script>