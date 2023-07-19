import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const deleteById = async (id: Number): Promise<void | Error> => {
  try{
    const result = await Knex(ETableNames.cidade)
      .where('id', id)
      .delete();
      
    if (result === 0) {
      return new Error('Erro ao deletar o registro de id ' + id);
    } else{
      return;
    }
  } catch(error){
    console.log(error);
    return new Error('Erro ao deletar o registro de id ' + id);
  }
};