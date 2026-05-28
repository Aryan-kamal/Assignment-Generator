import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignment,
  deleteAssignment,
  getPaper,
  regeneratePaper,
} from "../controllers/assignment.controller";

const router = Router();

router.get("/", getAssignments);
router.post("/", createAssignment);
router.get("/:id", getAssignment);
router.delete("/:id", deleteAssignment);
router.get("/:id/paper", getPaper);
router.post("/:id/regenerate", regeneratePaper);

export default router;
