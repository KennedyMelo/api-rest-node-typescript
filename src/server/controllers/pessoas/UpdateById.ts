import { Request, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { StatusCodes } from 'http-status-codes';
import { IPessoa } from '../../database/models';
import { PessoasProvider } from '../../database/providers/pessoas';

interface IParamProps {
  id?: Number;
}

interface IBodyProps  extends Omit<IPessoa, 'id'> {}

export const updateByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
  })),
  body: getSchema<IBodyProps>(yup.object().shape({
    nomeCompleto: yup.string().required().min(3),
    email: yup.string().required().email(),
    cidadeId: yup.number().integer().required().min(1)
  })),
}));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
  if(!req.params.id){
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.'
      }
    });
  }
  
  const result = await PessoasProvider.updateById(req.params.id, req.body);

  if(result instanceof Error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }
  return res.status(StatusCodes.NO_CONTENT).send();
};