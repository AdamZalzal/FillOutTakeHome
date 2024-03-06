"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateSubmissions = exports.filterResponse = exports.compareFilter = exports.removeParamFromURL = void 0;
const moment_1 = __importDefault(require("moment"));
const removeParamFromURL = (url, params) => {
    let updatedSearchParam = url;
    params.forEach((param) => {
        const [path, searchParams] = updatedSearchParam.split("?");
        const newSearchParams = searchParams === null || searchParams === void 0 ? void 0 : searchParams.split("&").filter((p) => !(p === param || p.startsWith(`${param}=`))).join("&");
        updatedSearchParam = newSearchParams ? `${path}?${newSearchParams}` : path;
    });
    return updatedSearchParam;
};
exports.removeParamFromURL = removeParamFromURL;
const compareFilter = (filter, question) => {
    if (filter.condition === "equals") {
        return filter.value === question.value;
    }
    if (filter.condition === "does_not_equal") {
        return filter.value !== question.value;
    }
    if (filter.condition === "greater_than") {
        if ((0, moment_1.default)(question.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
            if ((0, moment_1.default)(filter.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
                return (0, moment_1.default)(question.value).isAfter(filter.value);
            }
            return false;
        }
        return filter.value < question.value;
    }
    if (filter.condition === "less_than") {
        if ((0, moment_1.default)(question.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
            if ((0, moment_1.default)(filter.value, "YYYY-MM-DDTHH:mm:ss.sssZ").isValid()) {
                return (0, moment_1.default)(question.value).isBefore(filter.value);
            }
            return false;
        }
        return filter.value > question.value;
    }
    return false;
};
exports.compareFilter = compareFilter;
const filterResponse = (response, filters) => {
    let filteredResponse = response;
    if (filters) {
        let results = response.responses;
        const parsedFilters = JSON.parse(filters);
        parsedFilters.forEach((filter) => {
            const toRemove = new Set();
            results.forEach((submission) => {
                let filterSeen = false;
                submission.questions.forEach((question) => {
                    if (question.id === filter.id) {
                        filterSeen = true;
                        if (!(0, exports.compareFilter)(filter, question)) {
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
exports.filterResponse = filterResponse;
const paginateSubmissions = (submissions, pageLength, offset = 0) => {
    const paginatedArray = [];
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
exports.paginateSubmissions = paginateSubmissions;
