import type { CollectionBeforeChangeHook, Payload } from 'payload'
import payload from 'payload'

type CollectionSlug = Payload['config']['collections'][number]['slug']

export const generateLocalizedSlug: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data
  if (!data?.title) return data

  const slugParam = req.routeParams?.collectionSlug

  if (typeof slugParam !== 'string') return data

  const collectionSlug = slugParam as CollectionSlug

  data.slug = data.slug || {}

  for (const lang of Object.keys(data.title)) {
    const raw = data.title[lang] || ''

    const slug = raw
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const decodedSlug = decodeURIComponent(slug)

    const existing = await payload.find({
      collection: collectionSlug,
      where: {
        [`slug.${lang}`]: {
          equals: decodedSlug,
        },
      },
      limit: 1,
    })

    let finalSlug = decodedSlug

    if (existing.totalDocs > 0) {
      finalSlug = `${decodedSlug}-${Date.now()}`
    }

    data.slug[lang] = finalSlug
  }

  return data
}
