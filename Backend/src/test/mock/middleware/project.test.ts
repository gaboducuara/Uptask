import { createRequest, createResponse } from 'node-mocks-http';
import { ProjectExist } from '../../../middlewares/project';
import Project from '../../../models/Project';


jest.mock('../../../models/Project', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

/*Middleware ProjectExists*/
describe('Middleware ProjectExist', () => {
  it('Debe retornar status 400 si el id es incorrecto y message de error No es el Id Correcto.', async () => {
    const req = createRequest({
      method: 'GET',
      params: { projectId: 'id_invalido' }
    });
    const res = createResponse();
    const next = jest.fn();

    await ProjectExist(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.statusCode).not.toBe(200);
    expect(res.statusCode).not.toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'No es el Id Correcto.' });
    expect(next).not.toHaveBeenCalled();
  });
  it('Debe retornar status 404 si el proyecto no es encontrado.', async () => {

    (Project.findById as jest.Mock).mockResolvedValue(null);

    const req = createRequest({
      method: 'GET',
      params: { projectId: '682f6930636fe0a7b24aa3c2' }
    });
    const res = createResponse();
    const next = jest.fn();

    await ProjectExist(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Proyecto no encontrado' });
    expect(next).not.toHaveBeenCalled();
  });
  it('Debe retornar status 500 si ocurre un error interno', async () => {
    (Project.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    const req = createRequest({
      method: 'GET',
      params: { projectId: '507f1f77bcf86cd799439011' }
    });
    const res = createResponse();
    const next = jest.fn();

    await ProjectExist(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.statusCode).not.toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Existe error' });
    expect(next).not.toHaveBeenCalled();
  });
});