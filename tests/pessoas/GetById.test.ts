import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - GetById', () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({nome: 'Teste'});
      
    cidadeId = resCidade.body;
  });

  it('buscar registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer.get('/pessoas/' + res1.body);

    expect(res2.statusCode).toEqual(StatusCodes.OK);
    expect(res2.body).toBeDefined();
  });

  it('tentar buscar registro que não existe', async () => {
    const res1 = await testServer.get('/pessoas/99999');

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});