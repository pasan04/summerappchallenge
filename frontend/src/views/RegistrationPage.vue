<template>
    <main id="main-content" class="rvt-flex rvt-flex-column rvt-grow-1">
        <div class="rvt-layout__wrapper [ rvt-p-tb-xxl ]">
            <div class="rvt-container-sm">
                <div class="rvt-prose rvt-flow">
                    <div class="rvt-m-top-xxl rvt-p-all-xl rvt-bg-white rvt-card rvt-card--raised">
                        <div class="rvt-header-global__inner">
                            <div class="rvt-header-global__logo-slot">
                                <a class="rvt-lockup" href="#0">
                                    <div class="rvt-lockup__tab">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="rvt-lockup__trident" viewBox="0 0 28 34">
                                            <path fill="currentColor" d="M-3.34344e-05 4.70897H8.83308V7.174H7.1897V21.1426H10.6134V2.72321H8.83308V0.121224H18.214V2.65476H16.2283V21.1426H19.7889V7.174H18.214V4.64047H27.0471V7.174H25.0614V23.6761L21.7746 26.8944H16.2967V30.455H18.214V33.8787H8.76463V30.592H10.6819V26.8259H5.20403L1.91726 23.6077V7.174H-3.34344e-05V4.70897Z"></path>
                                        </svg>
                                    </div>
                                    <div class="rvt-lockup__body">
                                        <span class="rvt-lockup__title">Indiana University Bloomington</span>
                                        <span>SummerApp Challenge</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <form @submit.prevent="login()">
                            <div class="rvt-card__content [ rvt-p-top-none rvt-m-top-none rvt-border-top-none ]">
                                <h2 class="rvt-p-tb-md rvt-text-medium">REGISTRATION</h2>
                                <ul class="rvt-list-plain">
                                    <label for="text-input-username" class="rvt-label">Name</label>
                                    <input type="text" id="text-input-username" class="rvt-text-input" v-model="name" placeholder="Name" required>
                                    <label for="text-input-email" class="rvt-label">Email</label>
                                    <input type="text" id="text-input-email" class="rvt-text-input" v-model="email" placeholder="Email" required>
                                    <label for="text-input-password" class="rvt-label">Password</label>
                                    <input type="text" id="text-input-password" class="rvt-text-input" placeholder="Password" v-model="password" required>
                                    <label for="text-input-re_password" class="rvt-label">Re-password</label>
                                    <input type="text" id="text-input-re_password" class="rvt-text-input" placeholder="Re-password" v-model="repassword" required>
                                </ul>
                            </div>
                            <div class="rvt-m-top-md rvt-flex">
                                <button class="rvt-button">Sign Up</button>
                            </div>
                            <p>Already signed up? <router-link to="/login" class="login-class" style="text-decoration: underline;">sign-in</router-link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { API_CALL } from '../shared/content';

const name = ref<string>('');
const password = ref<string>('');
const email = ref<string>('');
const repassword = ref<string>('');

const login = async () => {
    if(password == repassword){
        try {
            const response = await axios.get(API_CALL + '/api/register/', {
                params: {
                    name: email.value,
                    email: email.value,
                    password: password.value,
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }

        // Clear the form inputs after submission (optional)
        name.value = '';
        email.value = '';
        password.value = '';
        repassword.value = '';
    }else{

    }
};
</script>