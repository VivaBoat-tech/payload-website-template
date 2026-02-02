import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, TypedLocale } from 'payload'
import { cache } from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageRange } from '@/components/PageRange'
import { generateMeta } from '@/utilities/generateMeta'
import { Pagination } from '@payloadcms/ui'
import PageClient from './page.client'

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const categories = await payload.find({
//     collection: 'categories',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   })

//   const params = categories.docs
//     ?.filter((doc) => {
//       return doc.slug !== 'home'
//     })
//     .map(({ slug }) => {
//       return { slug }
//     })

//   return params
// }

type Args = {
  params: Promise<{
    locale: TypedLocale
    slug?: string
  }>
}

export default async function Category({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'es', slug = '' } = await paramsPromise

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = `${locale}/boats/${decodedSlug}`

  const category = await queryCategory({ locale: locale, slug: decodedSlug })

  if (!category) return <PayloadRedirects url={url} />

  const boats = await queryCategoryBoats({ locale: locale })

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Category {category.title} [locale]/boats/[slug]/page.tsx</h1>
        </div>
      </div>

      {/* <PostHero post={boat} /> */}

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {/* <RichText className="max-w-[48rem] mx-auto" data={boat.content} enableGutter={false} /> */}
          <div className="container mb-8">
            <PageRange
              collection="boats"
              currentPage={boats.page}
              limit={12}
              totalDocs={boats.totalDocs}
            />
          </div>

          {boats && <CollectionArchive posts={boats.docs} relationTo="boat" locale={locale} />}

          <div className="container">
            {boats.totalPages > 1 && boats.page && (
              <Pagination page={boats.page} totalPages={boats.totalPages} />
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <pre>{JSON.stringify(category, null, 2)}</pre>
        <h3>boats:</h3>
        <pre>{JSON.stringify(boats, null, 2)}</pre>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'es', slug = '' } = await paramsPromise

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategory({ locale: locale, slug: decodedSlug })

  return generateMeta({ doc: category })
}

const queryCategory = cache(async ({ locale, slug }: { locale: TypedLocale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    // draft,
    limit: 1,
    // overrideAccess: draft,
    pagination: false,
    locale: locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryCategoryBoats = cache(async ({ locale }: { locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'boats',
    draft,
    limit: 12,
    pagination: true,
    overrideAccess: draft,
    locale: locale,
  })

  return result || null
})
