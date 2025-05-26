import { createRequest, createResponse } from 'node-mocks-http';
import { taskBelongsToProject } from '../../../middlewares/task';
import { tasks } from '../../unit/tasks';

describe('Middleware taskBelongsToProject', () => {
  it('Permite el paso si el projectId de la tarea coincide con el de los params', () => {
    const req = createRequest({
      params: { projectId: '682f6930636fe0a7b24aa3c0' },
      task: { ...tasks[0], project: '682f6930636fe0a7b24aa3c0' }
    });
    const res = createResponse();
    const next = jest.fn();

    taskBelongsToProject(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200); // No se modifica el status, sigue en 200
  });

  it('Retorna 400 si el projectId de la tarea NO coincide con el de los params', () => {
    const req = createRequest({
      params: { projectId: 'otro_id' },
      task: { ...tasks[0], project: '682f6930636fe0a7b24aa3c0' }
    });
    const res = createResponse();
    const next = jest.fn();

    taskBelongsToProject(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ status: 'error', message: 'Accion No valida.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Funciona aunque project sea tipo ObjectId simulando toString()', () => {
    const req = createRequest({
      params: { projectId: '682f6930636fe0a7b24aa3c0' },
      task: { ...tasks[0], project: { toString: () => '682f6930636fe0a7b24aa3c0' } }
    });
    const res = createResponse();
    const next = jest.fn();

    taskBelongsToProject(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
  });
});