import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - DeleteById', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'delete-pessoas@gmail.com';
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

  it('Tenta apagar um registro sem token de acesso', async () => {
    const res1 = await testServer
      .delete('/pessoas/17');
      
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('apagar registro', async () => {
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
      .delete('/pessoas/' + res1.body)
      .set(AccessToken);

    expect(res2.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('tentar apagar registro que não existe', async () => {
    const res1 = await testServer
      .delete('/pessoas/99999')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});