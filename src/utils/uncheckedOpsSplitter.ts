import { CrudOperations } from '../types/CrudOperations';

export default function (queryParam: string) {
  if (queryParam === '' || queryParam === undefined) return null;  
  return queryParam
    .split(',')
    .map((s) => s.toUpperCase())
    .map((v) => CrudOperations[v]) as CrudOperations[];
}
