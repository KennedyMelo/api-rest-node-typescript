import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - GetById', () => {
  it('apagar registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul'});

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer.get('/cidades/' + res1.body);

    expect(res2.statusCode).toEqual(StatusCodes.OK);
    expect(res2.body).toBeDefined();
    
  });

  it('tentar buscar registro que não existe', async () => {
    const res1 = await testServer.get('/cidades/99999');

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});