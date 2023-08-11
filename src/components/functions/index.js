import { typeColors } from '../static/data'

export const getTypeColor = (typeName) => {
  const typeNameLower = typeName.toLowerCase()
  return typeColors[typeNameLower] || null
}
