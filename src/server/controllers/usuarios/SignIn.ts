import { Request, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { StatusCodes } from 'http-status-codes';
import { IUsuario } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IBodyProps extends Omit<IUsuario, 'id' | 'nome'> {}

export const SignInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    email: yup.string().required().email(),
    senha: yup.string().required().min(6)
  })),

}));

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const {email, senha} = req.body;

  const result = await UsuariosProvider.getByEmail(email);
  if(result instanceof Error || senha !== result.senha){
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha são inválidos'
      }
    });
  } 
  
  return res.status(StatusCodes.OK).json({accessToken: 'teste.teste.teste'});
};