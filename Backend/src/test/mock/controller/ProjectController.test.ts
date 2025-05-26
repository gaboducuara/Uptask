import { createRequest, createResponse } from 'node-mocks-http'
import { projects } from '../../unit/project'
import { ProjectController } from '../../../controllers/ProjectController'
import Project from '../../../models/Project';

//prueba hacia proyectos
jest.mock('../../../models/Project', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

//Pruebas unitarias
describe('ProjectController.getAll', () => {

  it('Debe recuperar los proyectos existentes, status 200 y message: "Projectos obtenidos"', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/project',
    });
    const res = createResponse();

    (Project.find as jest.Mock).mockResolvedValue(projects);
    await ProjectController.getAllProject(req, res);
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200);
    expect(data.message).toEqual('Proyectos obtenidos')
    expect(data.data).toHaveLength(5)
    expect(Project.find).toHaveBeenCalledTimes(1)
    expect(res.status).not.toBe(500)
  })
  it('Gestiona error al no encontrar proyectos, status 404 Not found', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/project',
    });
    const res = createResponse();

    (Project.find as jest.Mock).mockResolvedValue([]); /*Cuando no existe algo en el metodo get entonces se implementa array vacio*/
    await ProjectController.getAllProject(req, res);
    const data = res._getJSONData()

    expect(res.statusCode).toBe(404);
    expect(data.error).toEqual('No existen proyectos actualmente')
    expect(res.status).not.toBe(200)
    expect(res.status).not.toBe(201)
    expect(res.status).not.toBe(500)
  })
  it('se Gestiona error cuando no encuentra proyectos, status 500', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/project',
    });

    const res = createResponse();

    (Project.find as jest.Mock).mockRejectedValue(new Error)
    await ProjectController.getAllProject(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(500)
    expect(data.error).toEqual('error al traer proyectos.') /*ayuda a similar el mensaje de error del controlador es decir se debe poner el mismo mensaje de error del controlador aqui*/
    expect(res.statusCode).not.toBe(200)
  })
})
describe('ProjectController.getProjectById', () => {

  beforeEach(() => {
    (Project.findById as jest.Mock).mockImplementation((projectId: string) => {
      const project = projects.filter(p => p._id === projectId)[0];
      return {
        populate: jest.fn().mockResolvedValue(project)
      }
    });
  })
  it('Debe recuperar el projecto con id "6816dde04fb5756d5a03effc", y las 3 tareas, status 200 y message: "Projecto obtenido"', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/project/:projectId',
      params: { projectId: '6816dde04fb5756d5a03effc' }
    });

    const res = createResponse();
    await ProjectController.getProjectById(req, res);

    const data = res._getJSONData();
    expect(data.data.tasks).toHaveLength(3);
    expect(res.statusCode).toBe(200);
    expect(data.message).toEqual('Proyecto obtenido');
    /*Metodo toHaveBeenCalled de Realizacion de llamado al metodo findByPk*/
    expect(Project.findById).toHaveBeenCalled();
    /*Metodo toHaveBeenCalledTimes metodo de realizacion de llamado a findByPk cuantas veces se llama en este caso 1 vez*/
    expect(Project.findById).toHaveBeenCalledTimes(1);
    expect(data.data._id).toBe('6816dde04fb5756d5a03effc');
    expect(res.status).not.toBe(500);
  });
});
describe('ProjectController.createProject', () => {
  it('Debería Crear un nuevo proyecto y responder con statusCode 201', async () => {

    const mockProject = {
      save: jest.fn().mockResolvedValue(true)
    };
    (Project.create as jest.Mock).mockResolvedValue(mockProject);

    const req = createRequest({
      method: 'POST',
      url: '/api/project',
      body: {
        projectName: 'Frameworks ADR',
        clientName: "Del pierro",
        description: "uso de Frameworks para proyectos de software para Brasil"
      }
    });

    const res = createResponse();
    await ProjectController.createProject(req, res);
    //Se espera un codigo 201
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toBe('Proyecto creado correctamente')
    /*Prueba para simular que el controlador create realmente guarda algo en la base de datos*/
    expect(mockProject.save).toHaveBeenCalled(); /*Metodo de Realizacion de llamado toHaveBeenCalled*/
    /*Forma normal para que se mande a llamar una ves y evitar registros duplicados, si se manda a llamar dos veces deberia salir error*/
    expect(mockProject.save).toHaveBeenCalledTimes(1);
    /*Un metodo ha sido llamado por un valor en especifico //project.create(req.body) -- Probar si project.create fue instanciado por req.body*/
    expect(Project.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).not.toBe(500)
    expect(res.statusCode).not.toBe(404)
  })

  it('Controlar handle project creation error', async () => {

    const mockProject = {
      save: jest.fn()
    };

    (Project.create as jest.Mock).mockRejectedValue(new Error);
    const req = createRequest({
      method: 'POST',
      url: '/api/project',
      body: {
        projectName: 'Frameworks ADR',
        clientName: "Del pierro",
        description: "uso de Frameworks para proyectos de software para Brasil"
      }
    });

    const res = createResponse();

    (Project.create as jest.Mock).mockRejectedValue(new Error)
    await ProjectController.createProject(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Error al crear el proyecto.' }); /*Simulando el error (500)*/
    /*Esta parte se realiza para no mandar a llamar el metodo save*/
    expect(mockProject.save).not.toHaveBeenCalled();
    /*Un metodo ha sido llamado por un valor en especifico //Project.create(req.body) -- Probar si Budget.create fue instanciado por req.body*/
    expect(Project.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).not.toBe(200)
    expect(res.statusCode).not.toBe(201)
  })
})
describe('ProjectController.updateById', () => {
  it('Recuperar la actualizacion del proyecto y Retornar el mensaje 200', async () => {

    const ProjectMock = {
      ...projects[0],
      save: jest.fn().mockResolvedValue(true)
    };

    (Project.findById as jest.Mock).mockResolvedValue(ProjectMock);

    const req = createRequest({
      method: 'PUT',
      url: '/api/project/681922baf628b77f2682d05f',
      project: ProjectMock,
      //Simular formulario
      body: {
        projectName: "Frameworks PKB",
        clientName: "Hugo Navarro",
        description: "uso de Frameworks A para proyectos de software moviles en todo el mundo"
      },
    });
    const res = createResponse();
    await ProjectController.updateProject(req, res);
    const data = res._getJSONData()

    expect(res.statusCode).toBe(200);
    expect(data).toEqual({message:'Proyecto Actualizado'})
    expect(ProjectMock.save).toHaveBeenCalledTimes(1);
    expect(res.statusCode).not.toBe(500)
  })
})
describe('ProjectController.deleteProject', () => {
  it('Elimina el proyecto y retorna el mensaje 200', async () => {

    const ProjectMock = {
      ...projects[0],
      deleteOne: jest.fn().mockResolvedValue(true)
    };

    // Simula que Project.findById devuelve la instancia mockeada
    (Project.findById as jest.Mock).mockResolvedValue(ProjectMock);

    const req = createRequest({
      method: 'DELETE',
      url: '/api/project/582d2e3532ace388d5806132',
      project: ProjectMock,
    });
    const res = createResponse();

    await ProjectController.deleteProject(req, res);
    const data = res._getJSONData();

    expect(Project.findById).toHaveBeenCalled();
    expect(ProjectMock.deleteOne).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual({message: 'Proyecto eliminado'});
  });
});
