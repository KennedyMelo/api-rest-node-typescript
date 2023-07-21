import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - Create', () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({nome: 'Teste'});
      
    cidadeId = resCidade.body;
  });

  it('Criar registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Criar registro 2', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Juca',
        email: 'Juca@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('tenta criar registro com email duplicado', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Juca',
        email: 'JucaDuplicado@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Juca2',
        email: 'JucaDuplicado@teste.com',
        cidadeId
      });

    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  
  it('Não pode criar um registro com nome completo muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Ke',
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
  });

  it('Deve preencher todos os campos', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompletoooo: 'Kennedy',
        emailll: 'kennedy@teste.com',
        cidadeiddd: 1
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });

  it('Deve não permitir ausência de nomeCompleto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        email: 'kennedy@teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
  });

  it('Deve não permitir ausência de email', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Deve não permitir ausência de cidadeId', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });

  it('Não pode aceitar registro com email inválido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy teste.com',
        cidadeId
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  
  it('Não pode aceitar registro com cidadeId com formato inválido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId: 'teste'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });

  it('Não pode aceitar registro com cidadeId que não exista', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({ 
        nomeCompleto: 'Kennedy',
        email: 'kennedy@teste.com',
        cidadeId: 9999999
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});