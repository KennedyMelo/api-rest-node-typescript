import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - DeleteById', () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({nome: 'Teste'});
      
    cidadeId = resCidade.body;
  });

  it('apagar registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer.delete('/pessoas/' + res1.body);

    expect(res2.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('tentar apagar registro que não existe', async () => {
    const res1 = await testServer.delete('/pessoas/99999');

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});