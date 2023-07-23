import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Pessoas - GetAll', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'GetAll-pessoas@gmail.com';
    await testServer.post('/cadastrar').send({nome: 'Teste', email, senha: '123456'});  
    const signInRes = await testServer.post('/entrar').send({email, senha: '123456'});
    AccessToken = {Authorization: `Bearer ${signInRes.body.accessToken}`};
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({nome: 'Teste'});
      
    cidadeId = resCidade.body;
  });

  it('Tenta receber todos registros sem token de acesso', async () => {
    const res1 = await testServer
      .get('/pessoas');
      
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Deve receber todos registros', async () => {
    const res = await testServer
      .post('/pessoas')
      .set(AccessToken)
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);


    const res1 = await testServer
      .get('/pessoas')
      .set(AccessToken);

    expect(Number(res1.header['x-total-count'])).toBeGreaterThan(0);
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body.length).toBeGreaterThan(0);
  });

  it('Deve receber erro quando enviar parâmetro limit ou page como string', async () => {
    const res1 = await testServer
      .get('/pessoas?limit=test&page=outroTest')
      .set(AccessToken);
    
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });

  it('Deve receber erro quando enviar parâmetro limit ou page com número menor igual a 0', async () => {
    const res1 = await testServer
      .get('/pessoas?limit=0&page=-2')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });
});