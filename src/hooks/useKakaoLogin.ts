import { useEffect, useState } from "react";
import { socialLogin } from "../services/auth";
import { useAuthStore } from "../store/authStore";

// Kakao SDK 타입 정의
interface Kakao {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (options: { redirectUri: string }) => void;
  };
}

declare global {
  interface Window {
    Kakao: Kakao;
  }
}

// 카카오 SDK 초기화
const kakaoInit = async (): Promise<void> => {
  if (!window.Kakao) throw new Error("Kakao SDK not loaded");
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
  }
};

// Redirect URI 설정 함수
const getRedirectUri = (): string => {
  return import.meta.env.VITE_KAKAO_REDIRECT_URI;
};

// 로그인 방식 결정 (웹: REST API, 앱: SDK)
const handleKakaoLogin = () => {
  const isMobileApp = /KAKAO/i.test(navigator.userAgent); // 앱 내 웹뷰 감지
  // const isMobileBrowser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const redirectUri = getRedirectUri();

  if (isMobileApp) {
    // 앱 환경에서는 SDK 활용
    if (!window.Kakao) return;
    window.Kakao.Auth.authorize({ redirectUri });
  } else {
    // 웹 환경에서는 REST API 방식 사용
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }
};

// 카카오 로그인 후 `인가 코드(code)` 백엔드로 전송
const handleAuthorizationCode = async (studentNumber: string) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error("인가 코드가 없습니다.");
      return;
    }

    console.log("📌 인가 코드:", code);

    // 백엔드로 인가 코드와 학번 전송
    const response = await socialLogin(code, "KAKAO", studentNumber);

    console.log("✅ 백엔드 응답:", response);

    // JWT 저장 (LocalStorage)
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
  } catch (error) {
    console.error("카카오 로그인 처리 실패:", error);
  }
};

export const useKakaoLogin = () => {
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);
  const studentNumber = useAuthStore((state) => state.studentNumber);

  useEffect(() => {
    kakaoInit()
      .then(() => setIsKakaoInitialized(true))
      .catch((error) => console.error("Kakao SDK initialization failed:", error));

    handleAuthorizationCode(studentNumber); // 로그인 후 인가 코드 처리
  }, [studentNumber]);

  return { isKakaoInitialized, handleKakaoLogin };
};
