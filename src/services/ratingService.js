import axiosInstance from '../api/axiosInstance';

const ratingService = {
  checkRatingStatus: async () => {
    try {
      const response = await axiosInstance.get('/rating/check');
      return response.data;
    } catch (error) {
      console.error('Error checking rating status:', error);
      throw error;
    }
  },

  submitRating: async (ratingData) => {
    try {
      const response = await axiosInstance.post('/rating', ratingData);
      return response.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  },

  getRatingStats: async () => {
    try {
      const response = await axiosInstance.get('/rating/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      throw error;
    }
  },

  getTestimonials: async () => {
    try {
      const response = await axiosInstance.get('/rating/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  }
};

export default ratingService;
