// src/services/contactService.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/users/';

/**
 * Submits the contact form data to the backend.
 * This uses a standard axios instance, not the authenticated one,
 * because anonymous users can submit the form.
 * @param {object} contactData - The form data.
 * @returns {Promise} - The axios promise.
 */
export const submitContactForm = (contactData) => {
  return axios.post(`${BASE_URL}contact/`, contactData);
};