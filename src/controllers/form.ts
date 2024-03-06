import { Request, Response } from "express";
import { filteredResponsesQueryInput } from "../utils/types";
import * as FormService from "../services/form";
import * as url from "url";
import { removeParamFromURL } from "../utils/helpers";

class FormController {
  static async filteredResponses(req: Request, res: Response): Promise<void> {
    try {
      const { formId } = req.params;
      const { filters, limit, offset }: filteredResponsesQueryInput = req.query;

      const cleanedUrl = removeParamFromURL(req.url, ["limit", "offset"]);
      const queryString = cleanedUrl.split("?").at(-1)

      if (!formId) {
        res.status(400).json({ error: "Form ID is required" });
        return;
      }

      const responses = await FormService.fetchResponses(
        formId,
        filters,
        queryString,
        limit,
        offset
      );

      res.status(200).json({ responses });
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default FormController;
