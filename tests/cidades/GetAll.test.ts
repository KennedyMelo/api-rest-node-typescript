import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetAll', () => {
  let AccessToken = {};
  beforeAll(async () => {
    const email = 'GetAll-cidades@gmail.com';
    await testServer.post('/cadastrar').send({nome: 'Teste', email, senha: '123456'});  
    const signInRes = await testServer.post('/entrar').send({email, senha: '123456'});
    AccessToken = {Authorization: `Bearer ${signInRes.body.accessToken}`};
  });

  it('Tenta receber registros sem token de acesso', async () => {
    const res1 = await testServer
      .get('/cidades');
      
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Deve receber todos registros', async () => {
    const res = await testServer
      .post('/cidades')
      .set(AccessToken)
      .send({nome: 'Caxias do Sul'});

    expect(res.statusCode).toEqual(StatusCodes.CREATED);


    const res1 = await testServer
      .get('/cidades')
      .set(AccessToken);

    expect(Number(res1.header['x-total-count'])).toBeGreaterThan(0);
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body.length).toBeGreaterThan(0);
  });

  it('Deve receber erro quando enviar parâmetro limit ou page como string', async () => {
    const res1 = await testServer
      .get('/cidades?limit=test&page=outroTest')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });

  it('Deve receber erro quando enviar parâmetro limit ou page com número menor igual a 0', async () => {
    const res1 = await testServer
      .get('/cidades?limit=0&page=-2')
      .set(AccessToken);

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.query.limit');
    expect(res1.body).toHaveProperty('errors.query.page');
  });
});