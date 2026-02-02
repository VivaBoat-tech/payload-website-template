import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, TypedLocale } from 'payload'
import { cache } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
    slug?: string
    locale?: TypedLocale
  }>
}

export default async function Category({ params: paramsPromise }: Args) {
  // const payload = await getPayload({ config: configPromise })

  const { slug = 'home', locale = 'en', pageNumber = 0 } = await paramsPromise
  console.log('category:', slug, ' locale:', locale, ' pageNumber:', pageNumber)

  const boats = await queryCategoryBoats({ locale })

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Category landing [locale]/boats/page.tsx</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="boats"
          currentPage={boats.page}
          limit={12}
          totalDocs={boats.totalDocs}
        />
      </div>

      <CollectionArchive posts={boats.docs} relationTo="boat" locale={locale} />

      <div className="container">
        {boats.totalPages > 1 && boats.page && (
          <Pagination page={boats.page} totalPages={boats.totalPages} />
        )}
      </div>

      <div className="container">
        <pre>{JSON.stringify(boats, null, 2)}</pre>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'es', slug = '' } = await paramsPromise

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategoryBySlug({ locale: locale, slug: decodedSlug })

  // if (!category?.title) category.meta.title = 'Boats'

  return generateMeta({ doc: category })
}

const queryCategoryBySlug = cache(
  async ({ locale, slug }: { locale: TypedLocale; slug: string }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'categories',
      limit: 1,
      pagination: false,
      locale: locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)

const queryCategoryBoats = cache(async ({ locale }: { locale: TypedLocale }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'boats',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    locale: locale,
    select: {
      title: true,
      slug: true,
      relatedCategories: true,
      meta: true,
    },
  })

  return result || null
})
