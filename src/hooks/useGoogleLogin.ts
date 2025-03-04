import { useGoogleLogin } from "@react-oauth/google";

export const useGoogleLoginHook = () => {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    onSuccess: (response) => {
      console.log("Google Auth Code:", response.code);
      sendCodeToBackend(response.code);
    },
    onError: (error) => console.error("Google 로그인 실패:", error),
  });

  const sendCodeToBackend = async (code: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      console.log("로그인 성공:", data);
    } catch (err) {
      console.error("서버 오류:", err);
    }
  };

  return { login };
};
