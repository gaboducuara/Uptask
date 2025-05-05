import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}
export async function TaskExist(req: Request, res: Response, next: NextFunction) {
  const { taskId } = req.params
  try {
    const task = await Task.findById(taskId)
    if (!task) {
      const e = new Error('Tarea No encontrado')
      res.status(404).json({ status: 'error', message: e.message })
      return
    }
    req.task = task
    next()
  } catch (error) {
    const e = new Error('Existe error, Tarea no encontrada.')
    res.status(500).json({ status: 'error', message: e.message })
    return
  }
}

//Este middleare sirve para evitar la eliminacion de tareas de proyectos en el cual no estas.
export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
  // Cuando se trabaja con los Id de mongo asegurarse que convertirlo a string por que el new ObjecId de mongo es raro es como si fuera un objeto
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error('Accion No valida.')
    res.status(400).json({ status: 'error', message: error.message })
    return
  }
  next()
}