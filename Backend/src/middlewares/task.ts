import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'
import mongoose from 'mongoose';
import { body } from 'express-validator';

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export async function TaskExist(req: Request, res: Response, next: NextFunction) {
  const { taskId } = req.params
  /*Validacion del Id de mongo*/
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'No es el Id Correcto.' });
  }
  try {
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return
    }
    req.task = task
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Existe error' });
  }
}
export const validateTasksInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name').notEmpty().withMessage('El Nombre de la Tarea es Obligatorio.')
    .isString().withMessage('El Nombre de la Tarea debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre de la Tarea debe tener al menos 3 caracteres.').bail().run(req)

  await body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
    .isString().withMessage('La descripcion debe ser un String.')
    .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.').bail().run(req)

    next();
}
//Este middleare sirve para evitar la eliminacion de tareas de proyectos en el cual no estas.
export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
  // Cuando se trabaja con los Id de mongo asegurarse que convertirlo a string por que el new ObjecId de mongo es raro es como si fuera un objeto
  if (req.task.project.toString() !== req.params.projectId.toString()) {
    const error = new Error('Accion No valida.')
    res.status(400).json({ status: 'error', message: error.message })
    return
  }
  next()
}