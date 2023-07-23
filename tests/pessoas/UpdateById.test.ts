import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - UpdateById', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'UpdateById-pessoas@gmail.com';
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

  it('Tenta atualizar um registro sem token de acesso', async () => {
    const res1 = await testServer
      .put('/pessoas/1')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
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
      .put('/pessoas/' + res1.body)
      .set(AccessToken)
      .send({ 
        nomeCompleto: 'Maria',
        email: 'Maria@teste.com',
        cidadeId: 2
      });

    expect(res2.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('tentar atualizar registro que não existe', async () => {
    const res1 = await testServer
      .put('/pessoas/99999')
      .set(AccessToken)
      .send({ 
        nomeCompleto: 'Maria2',
        email: 'Maria@teste2.com',
        cidadeId: 12
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});