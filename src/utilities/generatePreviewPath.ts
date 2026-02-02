import { PayloadRequest, CollectionSlug, TypedLocale } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
  categories: '/boats',
  boats: '/boat',
  routes: '/routes',
  posts: '/posts',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  locale: TypedLocale
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = async ({ collection, locale, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // console.log(req)

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    locale: locale,
    collection: collection,
    path: `/${locale}/${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
