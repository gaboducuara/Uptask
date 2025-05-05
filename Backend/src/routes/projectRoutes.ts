import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputError } from '../middlewares/validation';
import { TaskController } from '../controllers/TaskController';
import { ProjectExist } from '../middlewares/project';
import { taskBelongsToProject, TaskExist } from '../middlewares/task';

const router: Router = Router();

router.param('projectId', ProjectExist)
router.param('taskId', TaskExist)
router.param('taskId' , taskBelongsToProject)
//rutas Proyectos.
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

//Rutas de las Tareas
router.post('/:projectId/tasks',
  body('name').notEmpty().withMessage('El Nombre de la Tarea es Obligatorio.')
    .isString().withMessage('El Nombre de la Tarea debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre de la Tarea debe tener al menos 3 caracteres.'),

  body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
    .isString().withMessage('La descripcion debe ser un String.')
    .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    handleInputError,
  TaskController.createTask)
//traer varias tareas que pertenecen a un proyecto
router.get('/:projectId/tasks',
  TaskController.getProjectTask)
//traer una tarea por taskId
router.get('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('El Id del proyecto no es valida'),
  param('taskId').isMongoId().withMessage('El Id de la tarea no es valida'),
  handleInputError,
  TaskController.getTaskById)
//Actualizar una tarea
router.put('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('El Id de la tarea no es valida'),
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio.')
    .isString().withMessage('El Nombre del tarea debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del tarea debe tener al menos 3 caracteres.'),

  body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
    .isString().withMessage('La descripcion debe ser un String.')
    .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    handleInputError,
    TaskController.updateTask)

//Eliminar Tarea
router.delete('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('El Id del proyecto no es valida'),
  param('taskId').isMongoId().withMessage('El Id de la tarea no es valida'),
  handleInputError,
  TaskController.deleteTask)

router.post('/:projectId/tasks/:taskId/status',
  param('projectId').isMongoId().withMessage('El Id del proyecto no es valida'),
  param('taskId').isMongoId().withMessage('El Id de la tarea no es valida'),
  body('status').notEmpty().withMessage('El estado es Obligatorio'),
  handleInputError,
  TaskController.updateTaskStatus
)
export default router;