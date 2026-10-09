import { Router } from 'express';
import {
  listActiveHandler,
  listMineHandler,
  getOneHandler,
  createHandler,
  updateHandler,
  removeHandler,
} from '../controllers/itemController.js';
import { itemSchema, idSchema } from '../validators/itemValidators.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.use(authenticate);

router.get('/', listActiveHandler);
router.get('/mine', requireRole('store'), listMineHandler);
router.get('/:id', validate(idSchema, 'params'), getOneHandler);
router.post('/', requireRole('store'), validate(itemSchema), createHandler);
router.put(
  '/:id',
  requireRole('store'),
  validate(idSchema, 'params'),
  validate(itemSchema),
  updateHandler
);
router.delete('/:id', requireRole('store'), validate(idSchema, 'params'), removeHandler);

export default router;
