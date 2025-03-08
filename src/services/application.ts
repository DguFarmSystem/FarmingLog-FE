import apiConfig from "../config/apiConfig";
import { Application } from "../types/application"; 

export const fetchApplications = async (track?: string): Promise<Application[]> => {
  try {
    const response = await apiConfig.get<Application[]>("/admin/apply", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json",
      },
      params: track ? { track } : {},
    });

    return response.data.data; // data 속성 내부 배열만 반환하는 것으로 수정했는데 'Application[]' 형식에 'data' 속성이 없다는 오류 발생.
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "지원서 목록 조회 실패");
  }
};

