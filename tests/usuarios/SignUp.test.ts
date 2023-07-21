import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Usuarios - Signup', () => {
  it('cadastra usuário', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        email: 'kennedy@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('cadastra usuário 2', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Luan Santana',
        email: 'Luan@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('tenta criar cadastro com email duplicado', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        email: 'kennedy@teste2.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Maria',
        email: 'kennedy@teste.com',
        senha: '12345678'
      });

    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  
  it('Não pode criar um cadastro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Ke',
        email: 'kennedy@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Deve preencher todos os campos', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.senha');
  });

  it('Deve não permitir ausência de nomeCompleto', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        email: 'kennedy@teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Deve não permitir ausência de email', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        senha:'123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Deve não permitir ausência de senha', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        email: 'kennedy@teste.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });

  it('Não pode aceitar cadastro com email inválido', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        email: 'kennedy teste.com',
        senha: '123456'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Não pode aceitar cadastro com senha curta', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({ 
        nome: 'Kennedy',
        email: 'kennedy@teste.com',
        senha: '1234'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });
});