import express from "express";
import { 
  getDistricts, 
  getDivisionalSecretariats, 
  getGramaNiladhariDivisions,
  getDistrictNameById,
  getDivisionalSecretariatNameById,
  getGramaNiladhariDivisionNameById
} from "../controllers/area.controller.js";

const router = express.Router();

router.get("/districts", getDistricts);
router.get("/divisional-secretariats", getDivisionalSecretariats);
router.get("/grama-niladhari-divisions", getGramaNiladhariDivisions);
router.get("/districts/:id/name", getDistrictNameById);
router.get("/divisional-secretariats/:id/name", getDivisionalSecretariatNameById);
router.get("/grama-niladhari-divisions/:id/name", getGramaNiladhariDivisionNameById);

export default router;