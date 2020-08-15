import { db } from '../apiHelpers';
import { createEntity, updateEntity, deleteEntity } from '../apiHelpers'

export default (name: string, initialQuery?: any) => {
  let collection = db.collection(name);

  if (initialQuery) {
    initialQuery(collection)
  }

  return ({
    name,
    collection,
    updateFn: updateEntity,
    deleteFn: deleteEntity,
    createFn: (obj: any) => createEntity(collection, obj)
  });
}