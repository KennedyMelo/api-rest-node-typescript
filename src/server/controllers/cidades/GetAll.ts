import { Request, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { StatusCodes } from 'http-status-codes';

interface IQueryProps {
  page?: Number;
  limit?: Number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(yup.object().shape({
    limit: yup.number().optional().moreThan(0),
    page: yup.number().optional().moreThan(0),
    filter: yup.string().optional(),
  })),

}));

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  res.setHeader('accesss-control-expose-headers', 'x-total-count');
  res.setHeader('x-total-count', 1);
  
  console.log(req.query);

  return res.status(StatusCodes.OK).json([
    {
      id: 1,
      nome: 'Caxias do Sul',
    }
  ]);
};