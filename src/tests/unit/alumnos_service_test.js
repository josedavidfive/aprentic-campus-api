// MOCKS
jest.mock('../../models/Alumno');
const Alumno = require('../../models/Alumno');
const service = require('../../services/alumnos.service');

describe('Probamos el alumnos service GET', () => {
  it('Obtener alumnos al llamar Alumno.find', async () => {
    Alumno.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { nombre: 'Ana García', email: 'ana@test.com' }
      ])
    });
    const result = await service.obtenerAlumnos();
    expect(Alumno.find).toHaveBeenCalled();
    expect(result).toEqual([{ nombre: 'Ana García', email: 'ana@test.com' }]);
  });
});

describe('Probamos el alumnos service CREATE', () => {
  it('Crear alumno al llamar Alumno.create', async () => {
    const datos = { nombre: 'Luis López', email: 'luis@test.com' };
    Alumno.create.mockResolvedValue(datos);
    const result = await service.crearAlumno(datos);
    expect(Alumno.create).toHaveBeenCalledWith(datos);
    expect(result).toEqual(datos);
  });
});