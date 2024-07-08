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
        localStorage.setItem('user', JSON.stringify(response.data.token));
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
    }
    return response.data;
};

export const logoutFunc = async (email: string, password: string)=>{
    await axios.post<User>(`${API_CALL}/api/logout/`, { email, password });
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
