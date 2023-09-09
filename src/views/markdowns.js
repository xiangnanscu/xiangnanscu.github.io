const docs = import.meta.glob('../../docs/*.md', { as: 'raw' })

export const names = Object.keys(docs)
export const getContent = async (key) => {
  return await docs[key]()
}
