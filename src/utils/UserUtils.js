// src/utils/userUtils.js
import { login, register, logout } from '../api/auth.js';

/**
 * Creates a function that logs in a user.
 *
 * @param {function} setUserInfo - The function to call with the logged in user
 * @returns {function} A function that takes a username and a password, and returns a promise that resolves with the logged in user
 * @throws {Error} If the login fails
 */
export const createLoginUser = (setUserInfo) => async (username, password) => {
    try {
        const { token, user } = await login(username, password);
        localStorage.setItem('token', token);
        setUserInfo(user);
        return user;
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        throw error;
    }
};

/**
 * Creates a function that registers a new user.
 *
 * @param {function} setUserInfo - The function to call with the newly created user
 * @returns {function} A function that takes an email, a password and a username, and returns a promise that resolves with the newly created user
 * @throws {Error} If the registration fails
 */
export const createRegisterUser = (setUserInfo) => async (email, password, username) => {
    try {
        const { token, user } = await register(email, password, username);
        localStorage.setItem('token', token);
        setUserInfo(user);
        return user;
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        throw error;
    }
};

/**
 * Creates a function that logs out the current user.
 *
 * @param {function} setUserInfo - The function to call with null when the user is logged out
 * @returns {function} A function that returns a promise that resolves when the user is logged out
 * @throws {Error} If the logout fails
 */
export const createLogoutUser = (setUserInfo) => async () => {
    try {
        await logout();
        localStorage.removeItem('token');
        setUserInfo(null);
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        throw error;
    }
};