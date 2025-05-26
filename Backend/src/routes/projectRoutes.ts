import { Router } from 'express'
import { body } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputError } from '../middlewares/validation';
import { TaskController } from '../controllers/TaskController';
import { ProjectExist, validateProjectInput } from '../middlewares/project';
import { taskBelongsToProject, TaskExist, validateTasksInput } from '../middlewares/task';

const router: Router = Router();

// router.param('projectId', validateProjectId)
router.param('projectId', ProjectExist)
router.param('taskId', TaskExist)
router.param('taskId', taskBelongsToProject)
// router.param('status', validateTaskStatus)
//rutas Proyectos.
router.get('/', ProjectController.getAllProject)
router.get('/:projectId', handleInputError, ProjectController.getProjectById)
router.post('/', validateProjectInput, handleInputError, ProjectController.createProject)
router.put('/:projectId', validateProjectInput, handleInputError, ProjectController.updateProject)
router.delete('/:projectId', handleInputError, ProjectController.deleteProject)

//Rutas de las Tareas
router.post('/:projectId/tasks', validateTasksInput, handleInputError, TaskController.createTask)
//traer varias tareas que pertenecen a un proyecto
router.get('/:projectId/tasks', TaskController.getProjectTask)
//traer una tarea por taskId
router.get('/:projectId/tasks/:taskId', handleInputError, TaskController.getTaskById)
//Actualizar una tarea
router.put('/:projectId/tasks/:taskId', validateTasksInput, handleInputError, TaskController.updateTask)
//Eliminar Tarea
router.delete('/:projectId/tasks/:taskId', handleInputError, TaskController.deleteTask)
//Status
router.post('/:projectId/tasks/:taskId/status',
  body('status').notEmpty().withMessage('El estado es Obligatorio'),
  handleInputError, TaskController.updateTaskStatus
)
export default router;