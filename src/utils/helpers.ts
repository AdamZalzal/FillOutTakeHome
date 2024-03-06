import {
  FormResponse,
  Question,
  ResponseFilter,
  ResponseFiltersType,
  Submission,
} from "../utils/types";
import moment from "moment";

export const removeParamFromURL = (url: string, params: string[]) => {
  let updatedSearchParam = url;
  params.forEach((param) => {
    const [path, searchParams] = updatedSearchParam.split("?");
    const newSearchParams = searchParams
      ?.split("&")
      .filter((p) => !(p === param || p.startsWith(`${param}=`)))
      .join("&");
    updatedSearchParam = newSearchParams ? `${path}?${newSearchParams}` : path;
  });
  return updatedSearchParam;
};

export const compareFilter = (
  filter: ResponseFilter,
  question: Question
): boolean => {
  if (filter.condition === "equals") {
    return filter.value === question.value;
  }

  if (filter.condition === "does_not_equal") {
    return filter.value !== question.value;
  }

  if (filter.condition === "greater_than") {
    if (moment(question.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
      if (moment(filter.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
        return moment(question.value).isAfter(filter.value);
      }
      return false;
    }
    return filter.value < question.value;
  }

  if (filter.condition === "less_than") {
    if (moment(question.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
      if (moment(filter.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
        return moment(question.value).isBefore(filter.value);
      }
      return false;
    }
    return filter.value > question.value;
  }
  return false;
};

export const filterResponse = (response: FormResponse, filters?: string) => {
  let filteredResponse = response;
  if (filters) {
    let results = response.responses;

    const parsedFilters: ResponseFiltersType = JSON.parse(filters);
    parsedFilters.forEach((filter) => {
      const toRemove = new Set<string>();
      results.forEach((submission) => {
        let filterSeen = false;
        submission.questions.forEach((question) => {
          if (question.id === filter.id) {
            filterSeen = true;
            if (!compareFilter(filter, question)) {
              toRemove.add(submission.submissionId);
            }
          }
        });
        if (!filterSeen) {
          toRemove.add(submission.submissionId);
        }
      });
      results = results.filter((submission) => {
        return !toRemove.has(submission.submissionId);
      });
    });
    filteredResponse = {
      responses: results,
      totalResponses: results.length,
      pageCount: 1,
    };
  }
  return filteredResponse;
};

export const paginateSubmissions = (
  submissions: Submission[],
  pageLength: number,
  offset: number = 0
) => {
  const paginatedArray: Submission[][] = [];
  let startIndex = Math.max(offset, 0);
  let endIndex = Math.min(startIndex + pageLength, submissions.length);

  while (startIndex < submissions.length) {
    const slicedArray = submissions.slice(startIndex, endIndex);
    paginatedArray.push(slicedArray);

    startIndex = endIndex;
    endIndex = Math.min(startIndex + pageLength, submissions.length);
  }

  return paginatedArray;
};
