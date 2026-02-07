import express from 'express';
import { getImages, getCV, getWorkSamples } from '../controllers/apiController';

const router = express.Router();

// Route to get images
router.get('/images', getImages);

// Route to get CV
router.get('/cv', getCV);

// Route to get work samples
router.get('/work-samples', getWorkSamples);

export default router;