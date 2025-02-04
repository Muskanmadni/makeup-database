import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { Category } from './category'
import { SpecificCategory } from './specificcategory'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product , Category, SpecificCategory], 
}
