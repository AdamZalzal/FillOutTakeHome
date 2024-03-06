import express, { Router } from "express";
import FormController from "../controllers/form";

export const form = Router();
form.use(express.json());
form.get("/:formId/filteredResponses", FormController.filteredResponses);
