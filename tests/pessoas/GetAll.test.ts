import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Pessoas - GetAll', () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({nome: 'Teste'});
      
    cidadeId = resCidade.body;
  });

  it('Deve receber todos registros', async () => {
    const res = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);


    const res1 = await testServer.get('/pessoas');

    expect(Number(res1.header['x-total-count'])).toBeGreaterThan(0);
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body.length).toBeGreaterThan(0);
  });

  it('Deve receber erro quando enviar parâmetro limit ou page como string', async () => {
    const res1 = await testServer.get('/pessoas?limit=test&page=outroTest');
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });

  it('Deve receber erro quando enviar parâmetro limit ou page com número menor igual a 0', async () => {
    const res1 = await testServer.get('/pessoas?limit=0&page=-2');
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });
});