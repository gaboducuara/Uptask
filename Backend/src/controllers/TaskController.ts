import type { Request, Response } from 'express'
import Task from '../models/Task'
export class TaskController {
  static getProjectTask = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate('project') /*En este caso populate sirve para traer datos del proyecto que estan inmersos en las tareas es decir este get te trae todo las tareas pero con populate te añade los proyectos de las tareas*/
      res.json(tasks)
    } catch (e) {
      const error = new Error('Error al obtener las Tareas')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
  static getTaskById = async (req: Request, res: Response) => {
    try {
      // Cuando se trabaja con los Id de mongo asegurarse que convertirlo a string por que el new ObjecId de mongo es raro es como si fuera un objeto
      if (req.task.project.toString() !== req.project.id) {
        const error = new Error('Accion No valida.')
        res.status(400).json({ status: 'error', message: error.message })
        return
      }
      res.json(req.task)
    } catch (e) {
      const error = new Error('Error al obtener una tarea')
      res.status(500).json({ status: 'error', message: error.message })
      return
    }
  }
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body)
      //Asignacion de proyecto a la tarea
      task.project = req.project.id
      //en los proyectos existen varias tareas
      req.project.tasks.push(task.id)
      //Promise allSettled Sirve para que se ejecute varias promesas
      await Promise.allSettled([task.save(), req.project.save()])
      res.send('Tarea creada correctamente')
    } catch (error) {
      const e = new Error('Existe error en la creacion de la Tarea.')
      res.status(404).json({ status: 'error', message: e.message })
      return
    }
  }
  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name
      req.task.description = req.body.description
      //guardar cambios
      await req.task.save()
      res.send('Tarea Actualizada')
    } catch (e) {
      const error = new Error('Error al actualizar una tarea')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])
      res.send('Tarea Eliminada Correctamente')
    } catch (error) {
      const e = new Error('Error al eliminar una tarea')
      res.status(500).json({ status: 'error', message: e.message })
    }
  }
  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status
      req.task.save()
      res.send('Tarea Actualizada')
    } catch (error) {
      const e = new Error('Error al Actualizar el Estado')
      res.status(500).json({ status: 'error', message: e.message })
    }
  }
}