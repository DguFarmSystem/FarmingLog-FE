import { GoogleOAuthProvider } from "@react-oauth/google";
import { useKakaoLogin } from "../../hooks/useKakaoLogin";
import { useGoogleLoginHook } from "../../hooks/useGoogleLogin";
import { useAuthStore } from "../../store/authStore";

const LoginPageContent = () => {
  const { isKakaoInitialized, handleKakaoLogin } = useKakaoLogin();
  const { login: googleLogin } = useGoogleLoginHook();
  const studentNumber = useAuthStore((state) => state.studentNumber);
  const studentName = useAuthStore((state) => state.studentName);

  return (
    <div>
      <h1>Login Page</h1>
      {studentNumber && <p>Student Number: {studentNumber.toString()}</p>}
      {studentName && <p>Student Name: {studentName.toString()}</p>}
      {isKakaoInitialized ? (
        <>
          <button onClick={handleKakaoLogin}>Login with Kakao</button>
          <button onClick={() => googleLogin()}>Login with Google</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const LoginPage = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
