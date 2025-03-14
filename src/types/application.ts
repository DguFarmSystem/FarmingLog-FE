export interface Answer {
  questionId: number;
  content: string | null; 
  choiceId: number[];
}

export interface Application {
  applyId: number;
  name: string;
  track: string;
  updatedAt: string;
  major?: string;
  phoneNumber?: string;
  studentNumber?: string;
  email?: string;
  answers?: Answer[]; 
}


export interface ApplyQuestion {
  questionId: number; // 질문 ID
  content: string; // 질문 내용
  priority: number; // 정렬 우선순위
  choices?: { // 선택 옵션 (선택형 질문인 경우)
    choiceId: number;
    content: string;
  }[];
}
