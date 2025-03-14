import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicationDetail } from "../../services/applicationDetail";
import { Application, Answer, ApplyQuestion } from "../../types/application";
import { useEffect, useState } from "react";
import apiConfig from "../../config/apiConfig";

export const sortQuestionsByPriority = (
  questions: ApplyQuestion[]
): ApplyQuestion[] => {
  return questions.slice().sort((a, b) => a.priority - b.priority);
};

const ApplicationDetail = () => {
  const [questionData, setQuestionData] = useState<ApplyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { applyId } = useParams<{ applyId: string }>();
  const applicationId = applyId ? parseInt(applyId, 10) : undefined;

  // 지원서 상세 데이터 가져오기
  const { data, error: queryError, isLoading } = useQuery<Application>({
    queryKey: ["applicationDetail", applicationId],
    queryFn: () => fetchApplicationDetail(applicationId!.toString()),
    enabled: !!applicationId, 
  });

  // 질문 목록 가져오기 (priority 기준으로 정렬)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiConfig.get("/apply");
        const sortedQuestions = sortQuestionsByPriority(res.data.data);
        setQuestionData(sortedQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || loading) return <p>로딩 중...</p>;
  if (queryError || error) return <p>에러 발생: {queryError ? (queryError as Error).message : error}</p>;

  // questionId에 해당하는 질문 찾기
  const findQuestionContent = (questionId: number) => {
    const question = questionData.find((q) => q.questionId === questionId);
    return question ? question.content : "질문을 찾을 수 없습니다.";
  };

  const findChoiceContent = (questionId: number, choiceIds: number[]) => {
    const question = questionData.find((q) => q.questionId === questionId);
    if (!question || !question.choices) return "없음";

    const selectedChoices = question.choices
      .filter((choice) => choiceIds.includes(choice.choiceId))
      .map((choice) => choice.content);

    return selectedChoices.length > 0 ? selectedChoices.join(", ") : "없음";
  };

  const sortedAnswers = data?.answers
    ? [...data.answers].sort((a, b) => {
        const priorityA = questionData.find((q) => q.questionId === a.questionId)?.priority || 9999;
        const priorityB = questionData.find((q) => q.questionId === b.questionId)?.priority || 9999;
        return priorityA - priorityB;
      })
    : [];

  return (
    <div>
      <h1>지원서 상세</h1>
      {data ? (
        <>
          <p><strong>ID:</strong> {data.applyId}</p>
          <p><strong>이름:</strong> {data.name}</p>
          <p><strong>전공:</strong> {data.major}</p>
          <p><strong>전화번호:</strong> {data.phoneNumber}</p>
          <p><strong>학번:</strong> {data.studentNumber}</p>
          <p><strong>이메일:</strong> {data.email}</p>
          <p><strong>트랙:</strong> {data.track}</p>
          <p><strong>업데이트 날짜:</strong> {new Date(data.updatedAt).toLocaleString()}</p>

          <h2>답변</h2>
          {sortedAnswers.length > 0 ? (
            <ul>
              {sortedAnswers.map((answer: Answer) => (
                <li key={answer.questionId}>
                  <p><strong>질문:</strong> {findQuestionContent(answer.questionId)}</p>
                  <p><strong>답변 내용:</strong> {answer.content ?? "없음"}</p>
                  <p><strong>선택한 옵션:</strong> {findChoiceContent(answer.questionId, answer.choiceId)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>답변이 없습니다.</p>
          )}
        </>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default ApplicationDetail;
