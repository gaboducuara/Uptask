import type { Request, Response } from 'express'
import Task from '../models/Task'
export class TaskController {
  static getProjectTask = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId }) /*En este caso populate sirve para traer datos del proyecto que estan inmersos en las tareas es decir este get te trae todo las tareas pero con populate te añade los proyectos de las tareas*/
      res.status(200).json(tasks)
      return
    } catch (e) {
      const error = new Error('Error al obtener las Tareas')
      res.status(500).json({ status: 'error', message: error.message })
      return
    }
  }
  static getTaskById = async (req: Request, res: Response) => {
    // Cuando se trabaja con los Id de mongo asegurarse que convertirlo a string por que el new ObjecId de mongo es raro es como si fuera un objeto
    if (req.task.project.toString() !== req.params.projectId) {
      const error = new Error('Accion No valida.')
      res.status(400).json({ status: 'error', message: error.message })
      return
    }
    res.json(req.task)
  }
  static createTask = async (req: Request, res: Response) => {
    const task = await Task.create(req.body)
    //Asignacion de proyecto a la tarea
    task.project = req.project.id
    //en los proyectos existen varias tareas
    req.project.tasks.push(task.id)
    //Promise allSettled Sirve para que se ejecute varias promesas
    await Promise.allSettled([task.save(), req.project.save()])
    res.status(200).json({ message: 'Tarea creada correctamente' })
    return
  }
  static updateTask = async (req: Request, res: Response) => {
    req.task.name = req.body.name
    req.task.description = req.body.description
    //guardar cambios
    await req.task.save()
    res.status(201).json({ message: 'Tarea Actualizada' })
    return
  }
  static deleteTask = async (req: Request, res: Response) => {
    req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.params.taskId.toString())
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])
      res.status(200).json('Tarea Eliminada Correctamente')
      return
  }
  static updateTaskStatus = async (req: Request, res: Response) => {
      const { status } = req.body;
      req.task.status = status
      await req.task.save()
      res.status(200).json('Tarea Actualizada')
      return
  }
}