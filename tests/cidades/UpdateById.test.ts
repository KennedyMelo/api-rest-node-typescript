import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - UpdateById', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'UpdateById-cidades@gmail.com';
    await testServer.post('/cadastrar').send({nome: 'Teste', email, senha: '123456'});  
    const signInRes = await testServer.post('/entrar').send({email, senha: '123456'});
    AccessToken = {Authorization: `Bearer ${signInRes.body.accessToken}`};
  });
  
  it('Tenta atualizar registro sem token de acesso', async () => {
    const res1 = await testServer
      .put('/cidades/1')
      .send({nome: 'Caxias'});

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({ nome: 'Caxias do Sul'});

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer
      .put('/cidades/' + res1.body)
      .set(AccessToken)
      .send({nome: 'Caxias'});

    expect(res2.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('tentar atualizar registro que não existe', async () => {
    const res1 = await testServer
      .put('/cidades/99999')
      .set(AccessToken)
      .send({nome: 'Caxias'});

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});