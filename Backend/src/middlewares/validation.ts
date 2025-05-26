import type {Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/*Validacion de que el campo no puede estar vacio*/
export const handleInputError = (req:Request, res:Response, next:NextFunction ):void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
    return
  }
  next();
}