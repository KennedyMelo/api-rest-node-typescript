import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - Create', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'Create-cidades@gmail.com';
    await testServer.post('/cadastrar').send({nome: 'Teste', email, senha: '123456'});  
    const signInRes = await testServer.post('/entrar').send({email, senha: '123456'});
    AccessToken = {Authorization: `Bearer ${signInRes.body.accessToken}`};
  });

  it('Tenta criar um registro sem token de acesso', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul'});
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Criar registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({ nome: 'Caxias do Sul'});
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Não pode criar um registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({ nome: 'Ca'});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Deve preencher todos os campos', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({ nom: 'Caixa'});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
});