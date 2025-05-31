import express from "express";
import { 
  getDistricts, 
  getDivisionalSecretariats, 
  getGramaNiladhariDivisions 
} from "../controllers/area.controller.js";

const router = express.Router();

router.get("/districts", getDistricts);
router.get("/divisional-secretariats", getDivisionalSecretariats);
router.get("/grama-niladhari-divisions", getGramaNiladhariDivisions);

export default router;