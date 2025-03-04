import axios from "../config/apiConfig";

interface VerifyResponse {
  status: number;
  message: string;
  data: string;
}

export const verifyStudent = async (studentNumber: string): Promise<VerifyResponse> => {
  const response = await axios.post<VerifyResponse>("/user/verify", { studentNumber });
  return response.data;
};
