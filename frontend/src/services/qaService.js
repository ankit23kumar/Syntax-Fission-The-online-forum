// src/services/qaService.js
import axiosInstance from './api';

/* -------------------------------
   📌 QUESTIONS
----------------------------------*/

// Get all questions
export const getAllQuestions = () => axiosInstance.get('/questions/');

// Get single question details
export const getQuestionById = (questionId) => axiosInstance.get(`/questions/${questionId}/`);

// Ask a new question
export const askQuestion = (data) => axiosInstance.post('/questions/ask/', data);

// Update a question
export const updateQuestion = (questionId, data) =>
  axiosInstance.put(`/questions/${questionId}/update/`, data);

// Delete a question
export const deleteQuestion = (questionId) =>
  axiosInstance.delete(`/questions/${questionId}/delete/`);

// Post an answer to a question (through question endpoint)
export const postAnswerToQuestion = (questionId, data) =>
  axiosInstance.post(`/questions/${questionId}/answer/`, data);

// Create a view count (analytics)
export const createView = (data) => axiosInstance.post('/questions/views/', data);

/* -------------------------------
   📌 ANSWERS
----------------------------------*/

// Get all answers for a question
export const getAnswersForQuestion = (questionId) =>
  axiosInstance.get(`/answers/question/${questionId}/`);

// Create an answer (alternative if needed separately from postAnswerToQuestion)
export const createAnswer = (questionId, data) =>
  axiosInstance.post(`/answers/question/${questionId}/`, data);

// Update an answer
export const updateAnswer = (answerId, data) =>
  axiosInstance.put(`/answers/${answerId}/`, data);

// Delete an answer
export const deleteAnswer = (answerId) =>
  axiosInstance.delete(`/answers/${answerId}/`);

export const submitAnswer = (questionId, content) =>
  axiosInstance.post(`/questions/${questionId}/answer/`, { content });

// === VIEW COUNT ===
export const incrementViewCount = (questionId) =>
  axiosInstance.post('/questions/views/', { question: questionId });


// === TAGS ===
export const createOrGetTag = (tag_name) =>
  axiosInstance.post("/tags/", { tag_name });

// === Votes ===
// export const submitVote = (payload) => {
//   return axiosInstance.post('/votes/', payload); 
// };

export const submitVote = async ({ target_type, target_id, vote_type }) => {
  return axiosInstance.post("/votes/", {
    target_type,
    target_id,
    vote_type,
  });
};

