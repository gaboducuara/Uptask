import { createRequest, createResponse } from 'node-mocks-http'
import { tasks } from '../../unit/tasks'
import { TaskController } from '../../../controllers/TaskController'
import Task from '../../../models/Task';

//prueba hacia proyectos
jest.mock('../../../models/Task', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

describe('TaskController.getProjectTask', () => {
  it('Validar el metodo fin({})  y el status 200', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/682f6930636fe0a7b24aa3c0/tasks',
      params: { projectId: '682f6930636fe0a7b24aa3c0' }
    });

    (Task.find as jest.Mock).mockResolvedValue(tasks);
    const res = createResponse();

    await TaskController.getProjectTask(req, res);
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200);
    expect(data).toHaveLength(5)
    expect(Task.find).toHaveBeenCalledTimes(1)
    expect(res.status).not.toBe(500)
    expect(res.status).not.toBe(404)
    expect(res.status).not.toBe(201)
    expect(data).toEqual(tasks)
  })
});
describe('TaskController.getTaskById', () => {
  it('Validar el metodo fin({})  y el status 200', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/682f6930636fe0a7b24aa3c0/tasks',
      params: { projectId: '682f6930636fe0a7b24aa3bb' },
      task: tasks[0]
    });
    const res = createResponse();

    await TaskController.getTaskById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(400);
    expect(data).toEqual({ status: 'error', message: 'Accion No valida.' });
  })
});
describe('TaskController.updateTask', () => {
  it('Debe retornar status 201 y mensage de Tarea Actualizada', async () => {

    const tasksMock = {
      ...tasks[0],
      save: jest.fn().mockResolvedValue(true)
    }

    const req = createRequest({
      method: 'PUT',
      body: {
        name: 'Framework Actualizado',
        description: 'Diseñar la pantalla principal en Figma',
      },
      task: tasksMock,
    })
    const res = createResponse();

    await TaskController.updateTask(req, res);
    const data = res._getJSONData();
    expect(tasksMock.name).toBe('Framework Actualizado');
    expect(tasksMock.description).toBe('Diseñar la pantalla principal en Figma');
    expect(tasksMock.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.statusCode).not.toBe(404)
    expect(data).toEqual({ message: 'Tarea Actualizada' });
  });
});
describe('TaskController.deleteTask', () => {
  it('Debe eliminar la tarea del proyecto y retornar mensaje de éxito', async () => {
    const tasksMock = {
      ...tasks[0],
      deleteOne: jest.fn().mockResolvedValue(true)
    }

    const req = createRequest({
      method: 'DELETE',
      params: { taskId: tasksMock._id },
      task: tasksMock,
      project: {
        tasks: [tasksMock._id, 'otro_id'],
        save: jest.fn().mockResolvedValue(true)
      }
    })
    const res = createResponse();
    await TaskController.deleteTask(req, res);

    expect(tasksMock.deleteOne).toHaveBeenCalled();
    expect(req.project.tasks).not.toContain(tasksMock._id);
  expect(req.project.save).toHaveBeenCalled();
  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual('Tarea Eliminada Correctamente');
  })
})
describe('TaskController.updateTaskStatus', () => {
  it('Debe actualizar el status de la tarea y retornar mensaje de éxito', async () => {
    const mockTask = {
      status: 'pending',
      save: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: 'POST',
      body: { status: 'completed' },
      task: mockTask,
    });
    const res = createResponse();

    await TaskController.updateTaskStatus(req, res);

    expect(mockTask.status).toBe('completed');
    expect(mockTask.save).toHaveBeenCalled();
    expect(res._getJSONData()).toEqual('Tarea Actualizada');
  });
});