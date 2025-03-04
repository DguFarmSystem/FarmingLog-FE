import { create } from 'zustand';

interface AuthState {
  studentNumber: string;
  studentName: string;
  setStudentInfo: (studentNumber: string, studentName: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  studentNumber: '',
  studentName: '',
  setStudentInfo: (studentNumber, studentName) => set({ studentNumber, studentName }),
}));