import apiConfig from "../config/apiConfig";

export const socialLogin = async (
  code: string,
  socialType: "KAKAO",
  studentNumber?: string // 기존 회원은 불필요
) => {
  try {
    const response = await apiConfig.post("/auth/login", {
      code,
      socialType,
      studentNumber,
    });

    return response.data; 
  } catch (error) {
    console.error("소셜 로그인 실패:", error);
    throw error;
  }
};
