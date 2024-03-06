import { filterResponse, paginateSubmissions } from "../utils/helpers";

export const fetchResponses = async (
  formId: string,
  filters?: string,
  queryString?: string,
  limit?: number,
  offset?: number
) => {
  const request = await fetch(
    `https://api.fillout.com/v1/api/forms/${formId}/submissions?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
      },
    }
  );
  const response = await request.json();
  const filteredResponse = filterResponse(response, filters);
  if (limit) {
    const paginatedResults = paginateSubmissions(
      filteredResponse.responses,
      limit,
      offset
    );
    return {
      responses: paginatedResults[0],
      pageCount: Math.ceil(filteredResponse.totalResponses / limit),
      totalResponses: filteredResponse.totalResponses,
    };
  }
  return filteredResponse;
};
