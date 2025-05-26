import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from '../models/Project'
import mongoose from 'mongoose';
import { body } from 'express-validator';

declare global {
  namespace Express {
    interface Request {
      project: IProject
    }
  }
}

export async function ProjectExist(req: Request, res: Response, next: NextFunction) {
  const { projectId } = req.params

  /*Validacion del Id de mongo*/
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'No es el Id Correcto.' });
  }

  try {
    const project = await Project.findById(projectId)
    if (!project) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return
    }
    req.project = project
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Existe error' });
  }
}
export const validateProjectInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('projectName').notEmpty().withMessage('El Nombre del proyecto es Obligatorio.')
    .isString().withMessage('El Nombre del proyecto debe ser un String.')
    .isLength({ min: 3 }).withMessage('El Nombre del proyecto debe tener al menos 3 caracteres.').bail().run(req)

    await body('clientName').notEmpty().withMessage('El Nombre del cliente es Obligatorio.')
      .isString().withMessage('El Nombre del cliente debe ser un String.')
      .isLength({ min: 3 }).withMessage('El Nombre del cliente debe tener al menos 3 caracteres.').bail().run(req)

    await body('description').notEmpty().withMessage('La descripcion es Obligatoria.')
      .isString().withMessage('La descripcion debe ser un String.')
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.').bail().run(req)

    next();
}