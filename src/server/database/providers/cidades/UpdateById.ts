import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { ICidade } from '../../models';

export const updateById = async (id: Number, cidade: Omit<ICidade, 'id'>): Promise<void | Error> => {
  try{
    const result = await Knex(ETableNames.cidade)
      .where('id', id)
      .update(cidade);
    
    if (result === 0) {
      return new Error('Erro ao atualizar o registro de id ' + id);
    } else{
      return ;
    }
  } catch(error){
    console.log(error);
    return new Error('Erro ao atualizar o registro de id ' + id);
  }
};