import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - GetById', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'GetById-pessoas@gmail.com';
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

  it('Tenta buscar um registro sem token de acesso', async () => {
    const res1 = await testServer
      .get('/pessoas/1');
      
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('buscar registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set(AccessToken)
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer
      .get('/pessoas/' + res1.body)
      .set(AccessToken);

    expect(res2.statusCode).toEqual(StatusCodes.OK);
    expect(res2.body).toBeDefined();
  });

  it('tentar buscar registro que não existe', async () => {
    const res1 = await testServer
      .get('/pessoas/99999')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});