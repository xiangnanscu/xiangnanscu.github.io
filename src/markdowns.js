const docs = import.meta.glob('../docs/*.md', { as: 'raw' })
console.log({ docs })
export const names = Object.keys(docs)
export const getContent = async (key) => {
  return await docs[key]()
}
