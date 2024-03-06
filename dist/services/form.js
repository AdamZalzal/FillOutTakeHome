"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchResponses = void 0;
const helpers_1 = require("../utils/helpers");
const fetchResponses = (formId, filters, queryString, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield fetch(`https://api.fillout.com/v1/api/forms/${formId}/submissions?${queryString}`, {
        headers: {
            Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
        },
    });
    const response = yield request.json();
    if (response === null || response === void 0 ? void 0 : response.responses) {
        const filteredResponse = (0, helpers_1.filterResponse)(response, filters);
        if (limit) {
            const paginatedResults = (0, helpers_1.paginateSubmissions)(filteredResponse.responses, limit, offset);
            return {
                responses: paginatedResults[0],
                pageCount: Math.ceil(filteredResponse.totalResponses / limit),
                totalResponses: filteredResponse.totalResponses,
            };
        }
        return filteredResponse;
    }
    return response;
});
exports.fetchResponses = fetchResponses;
