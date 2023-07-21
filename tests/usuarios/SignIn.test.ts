import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Usuarios - signIn', () => {
  beforeAll(async () => {
    await testServer.post('/cadastrar').send({
      nome: 'Kennedy',
      email: 'kennedy@teste.com',
      senha: '123456'
    });
  });

  it('logar usuário', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({ 
        email: 'kennedy@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken');
  });

  it('tentar logar usuário sem estar com email cadastrado', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: 'lucas@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('tentar logar usuário cadastrado, porém com senha errada', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: 'kennedy@teste.com',
        senha: 'inventei'
      });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('tentar logar usuário com formato de email inválido', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: 'kennedy teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('tentar logar usuário com senha curta', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: 'kennedy teste.com',
        senha: '1235'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });

  it('tentar logar usuário sem o email', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        senha: '12356'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('tentar logar usuário sem a senha', async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: 'kennedy@teste.com'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });
});