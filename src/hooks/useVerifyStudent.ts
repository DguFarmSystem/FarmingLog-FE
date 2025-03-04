import { useQuery } from "@tanstack/react-query";
import { verifyStudent } from "../services/verify";

export const useVerifyStudent = (studentNumber: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["verifyStudent", studentNumber],
    queryFn: () => verifyStudent(studentNumber),
    enabled, // 기본적으로 비활성화 (수동 실행)
    retry: 1, // 요청 실패 시 1번만 재시도
  });
};
