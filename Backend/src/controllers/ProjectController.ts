import type { Request, Response } from 'express'
import Project from '../models/Project'
export class ProjectController {
  static getAllProject = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.status(200).json({ status: 'success', message: 'Proyectos obtenidos', data: projects })
    } catch (e) {
      const error = new Error('Error al obtener los proyectos')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id).populate('tasks') /*En este caso populate sirve para traer Todas las tareas de los proyectos.*/
      res.status(200).json({ status: 'success', message: 'Proyecto obtenido', data: project })
    } catch (e) {
      const error = new Error('Error al obtener el proyecto')
      res.status(500).json({ status: 'error', message: error.message })
      return
    }
  }
  static createProject = async (req: Request, res: Response) => {
    try {
      const project = new Project(req.body)
      if (!project) {
        const error = new Error('Error al crear el proyecto')
        res.status(404).json({ status: 'error', message: error.message })
        return
      }
      await project.save()
      res.send('Proyecto creado correctamente')
    } catch (e) {
      const error = new Error('Error al crear el proyecto')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id)
      if (!project) {
        const error = new Error('Error al actualizar el proyecto')
        res.status(404).json({ status: 'error', message: error.message })
        return
      }
      project.projectName = req.body.projectName
      project.clientName = req.body.clientName
      project.description = req.body.description
      await project.save()
      res.send('Proyecto Actualizado')
    } catch (e) {
      const error = new Error('Error al actualizar el proyecto')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id).deleteOne()
      if (!project) {
        const error = new Error('Error al eliminar proyecto')
        res.status(404).json({ status: 'error', message: error.message })
        return
      }
      res.send('Proyecto eliminado')
    } catch (e) {
      const error = new Error('Error al eliminar proyecto')
      res.status(500).json({ status: 'error', message: error.message })
    }
  }
}