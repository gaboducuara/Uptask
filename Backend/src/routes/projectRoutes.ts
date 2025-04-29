import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputError } from '../middlewares/validation';

const router: Router = Router();

router.get('/', ProjectController.getAllProject)
router.get('/:id',
  param('id').isMongoId().withMessage('El Id del proyecto no es valido.'),
    handleInputError,
  ProjectController.getProjectById)
router.post('/',
  body('projectName').notEmpty().withMessage('El Nombre del proyecto es Obligatorio.')
    .isString().withMessage('El Nombre del proyecto debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del proyecto debe tener al menos 3 caracteres.'),

  body('clientName').notEmpty().withMessage('El Nombre del cliente es Obligatorio.')
    .isString().withMessage('El Nombre del cliente debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del cliente debe tener al menos 3 caracteres.'),

  body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
    .isString().withMessage('La descripcion debe ser un String.')
    .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    handleInputError,
  ProjectController.createProject)
router.put('/:id',
  param('id').isMongoId().withMessage('El Id del proyecto no es valido.'),
  body('projectName').notEmpty().withMessage('El Nombre del proyecto es Obligatorio.')
    .isString().withMessage('El Nombre del proyecto debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del proyecto debe tener al menos 3 caracteres.'),

  body('clientName').notEmpty().withMessage('El Nombre del cliente es Obligatorio.')
    .isString().withMessage('El Nombre del cliente debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del cliente debe tener al menos 3 caracteres.'),

  body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
    .isString().withMessage('La descripcion debe ser un String.')
    .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    handleInputError,
  ProjectController.updateProject)
router.delete('/:id',
  param('id').isMongoId().withMessage('El Id del proyecto no es valido.'),
  handleInputError,
  ProjectController.deleteProject)
export default router;