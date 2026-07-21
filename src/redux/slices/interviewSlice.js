import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentInterview: null,
  interviewType: null, // 'hr' | 'technical' | 'voice' | 'coding'
  messages: [],
  isActive: false,
  timer: 0,
  score: null,
  difficulty: 'medium',
  technology: null,
  isRecording: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action) => {
      state.currentInterview = action.payload.id;
      state.interviewType = action.payload.type;
      state.isActive = true;
      state.messages = [];
      state.timer = 0;
      state.score = null;
    },
    endInterview: (state) => {
      state.isActive = false;
      state.isRecording = false;
    },
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    updateTimer: (state, action) => {
      state.timer = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setTechnology: (state, action) => {
      state.technology = action.payload;
    },
    setRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    resetInterview: () => initialState,
  },
});

export const {
  startInterview,
  endInterview,
  addMessage,
  updateTimer,
  setScore,
  setDifficulty,
  setTechnology,
  setRecording,
  resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
