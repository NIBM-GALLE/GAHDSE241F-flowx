import { Router } from 'express';
import {
  getDistricts,
  getDivisionalSecretariats,
  getAllDivisionalSecretariats,
  getGramaNiladhariDivisions,
  getDistrictNameById,
  getDivisionalSecretariatNameById,
  getGramaNiladhariDivisionNameById
} from '../controllers/area.controller.js';

const router = Router();


router.get('/districts', getDistricts);  // /api/area/districts
router.get('/divisional-secretariats', getDivisionalSecretariats);   // /api/area/divisional-secretariats?district_id=xxx
router.get('/divisional-secretariats/all', getAllDivisionalSecretariats);  //  /api/area/divisional-secretariats/all
router.get('/grama-niladhari-divisions', getGramaNiladhariDivisions);  // /api/area/grama-niladhari-divisions?divisional_secretariat_id=xxx
router.get('/districts/:id/name', getDistrictNameById);  // /api/area/districts/:id/name
router.get('/divisional-secretariats/:id/name', getDivisionalSecretariatNameById);  // /api/area/divisional-secretariats/:id/name
router.get('/grama-niladhari-divisions/:id/name', getGramaNiladhariDivisionNameById);  // /api/area/grama-niladhari-divisions/:id/name

export default router;
