import axios from 'axios';
import { API_CALL } from './shared/content';
import {useRouter} from "vue-router";

const router = useRouter();
interface User {
    token: string;
    email: string;
}

export const login = async (email: string, password: string): Promise<User> => {
    const response = await axios.post<User>(`${API_CALL}/api/login/`, { email, password });
    if (response.data.token) {
        // call this method to get the username and password
        const res = await axios.get(`${API_CALL}/api/getuserbyemail/`, {
            params: { email: email },
            headers: { 'Content-Type': 'application/json' }
        });

        localStorage.setItem('user', JSON.stringify(response.data.token));
        localStorage.setItem('email', res.data.email)
    }
    return response.data;
};

export const logoutFunc = async (user: string)=>{
    await axios.post<User>(`${API_CALL}/api/logout/`, { user });
    localStorage.removeItem('user');
    localStorage.removeItem('email');
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
