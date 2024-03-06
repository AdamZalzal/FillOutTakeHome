export type filteredResponsesQueryInput = {
  filters?: string;
  limit?: number;
  offset?: number;
};

export type Calculation = {
  id: string;
  name: string;
  type: string;
  value: number;
};

export type UrlParameter = {
  id: string;
  name: string;
  value: string;
};

export type Question = {
  id: string;
  name: string;
  type: string;
  value: string | number;
};

export type Submission = {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: Question[];
  calculations: Calculation[];
  urlParameters: UrlParameter[];
  quiz?: {
    score: number;
    maxScore: number;
  };
};
export type FormResponse = {
  responses: Submission[];
  totalResponses: number;
  pageCount: number;
};

export type ResponseFilter = {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: number | string;
};

export type ResponseFiltersType = ResponseFilter[];
