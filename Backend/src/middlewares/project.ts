import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from '../models/Project'

declare global {
  namespace Express {
    interface Request {
      project: IProject
    }
  }
}
export async function ProjectExist( req: Request, res: Response, next: NextFunction ) {
  const { projectId } = req.params
  try {
    const project = await Project.findById(projectId)
    if (!project) {
      const e = new Error('Proyecto No encontrado')
      res.status(404).json({ status: 'error', message: e.message })
      return
    }
    req.project = project
    next()
  } catch (error) {
    const e = new Error('Existe error, proyecto no encontrado.')
    res.status(500).json({ status: 'error', message: e.message })
    return
  }
}
