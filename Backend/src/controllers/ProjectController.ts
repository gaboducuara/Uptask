import type { Request, Response } from 'express'
import Project from '../models/Project'
export class ProjectController {
  static getAllProject = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      if(projects.length === 0) {
        res.status(404).json({ error: 'No existen proyectos actualmente' })
      return
      }
      res.status(200).json({message: 'Proyectos obtenidos', data: projects});
      return
    } catch (e) {
      res.status(500).json({ error: 'error al traer proyectos.' })
      return
    }
  }
  static getProjectById = async (req: Request, res: Response) => {
      const project = await Project.findById(req.params.projectId).populate('tasks') /*En este caso populate sirve para traer Todas las tareas de los proyectos.*/
      res.status(200).json({message: 'Proyecto obtenido', data: project })
      return
  }
  static createProject = async (req: Request, res: Response) => {
    try {
      const project = await Project.create(req.body)
      await project.save();
      res.status(201).json('Proyecto creado correctamente');
    } catch (e) {
      res.status(500).json({ error: 'Error al crear el proyecto.' })
      return
    }
  }
  static updateProject = async (req: Request, res: Response) => {
      const { projectId } = req.params
      const project = await Project.findById(projectId)
      project.projectName = req.body.projectName
      project.clientName = req.body.clientName
      project.description = req.body.description
      await project.save()
      res.status(200).json({ message: 'Proyecto Actualizado' })
      return
  }
  static deleteProject = async (req: Request, res: Response) => {
      const { projectId } = req.params
      const project = await Project.findById(projectId)
      await project.deleteOne()
      res.status(200).json({ message: 'Proyecto eliminado'})
      return
  }
}