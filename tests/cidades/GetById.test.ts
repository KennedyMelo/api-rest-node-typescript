import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - GetById', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'GetById-cidades@gmail.com';
    await testServer.post('/cadastrar').send({nome: 'Teste', email, senha: '123456'});  
    const signInRes = await testServer.post('/entrar').send({email, senha: '123456'});
    AccessToken = {Authorization: `Bearer ${signInRes.body.accessToken}`};
  });

  it('Tenta buscar registro sem token de acesso', async () => {
    const res1 = await testServer
      .get('/cidades/1');

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('buscar registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({ nome: 'Caxias do Sul'});

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const res2 = await testServer
      .get('/cidades/' + res1.body)
      .set(AccessToken);

    expect(res2.statusCode).toEqual(StatusCodes.OK);
    expect(res2.body).toBeDefined();
    
  });

  it('tentar buscar registro que não existe', async () => {
    const res1 = await testServer
      .get('/cidades/99999')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});