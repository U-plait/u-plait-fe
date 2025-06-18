// src/api/review.js
import api from './api'; // Assuming 'api' is an Axios instance configured with a base URL.

/**
 * Fetches a paginated list of reviews for the admin panel.
 * @param {number} page - The page number to retrieve (0-indexed).
 * @param {number} size - The number of items per page.
 * @returns {Promise<object>} A promise that resolves to the API response,
 * containing pagination info and review list.
 * Expected format: { statusCode: number, message: string, data: { content: [], number: number, totalPages: number, ... } }
 */
export const getReviewsAPI = async (page = 0, size = 20) => {
  try {
    const response = await api.get(`/admin/review`, {
      params: {
        page,
        size,
        sort: 'reviewId,desc', // Sort by reviewId in descending order
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error: getReviewsAPI", error);
    // Re-throw to allow component to handle specific error UI
    throw error;
  }
};

/**
 * Fetches detailed information for a specific review by its ID.
 * @param {number} reviewId - The ID of the review to fetch.
 * @returns {Promise<object>} A promise that resolves to the API response,
 * containing the detailed review data.
 * Expected format: { statusCode: number, message: string, data: ReviewDetailResponse }
 */
export const getReviewDetailAPI = async (reviewId) => {
  try {
    // The backend mapping is @GetMapping("/{reviewId}")
    const response = await api.get(`/admin/review/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error: getReviewDetailAPI for ID ${reviewId}`, error);
    throw error;
  }
};

/**
 * Deletes a specific review by its ID.
 * @param {number} reviewId - The ID of the review to delete.
 * @returns {Promise<object>} A promise that resolves to the API response upon successful deletion.
 * Expected format: { statusCode: number, message: string, data: AdminReviewDeleteResponse }
 */
export const deleteReviewAPI = async (reviewId) => {
  try {
    // The backend mapping is @DeleteMapping("/{reviewId}")
    const response = await api.delete(`/admin/review/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error: deleteReviewAPI for ID ${reviewId}`, error);
    throw error;
  }
};

/**
 * Helper function to delete multiple reviews in a batch.
 * It internally calls the single delete API for each review ID.
 * @param {number[]} reviewIds - An array of review IDs to delete.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of results from each delete request.
 */
export const deleteMultipleReviewsAPI = async (reviewIds) => {
  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    console.warn("deleteMultipleReviewsAPI called with empty or invalid reviewIds array.");
    return [];
  }
  try {
    const deletePromises = reviewIds.map(id => deleteReviewAPI(id));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("API Error: deleteMultipleReviewsAPI", error);
    throw error;
  }
};