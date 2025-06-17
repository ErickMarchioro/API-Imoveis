import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: 'public' });
});

export default router;