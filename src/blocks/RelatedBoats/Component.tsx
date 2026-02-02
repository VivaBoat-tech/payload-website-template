import RichText from '@/components/RichText'
import clsx from 'clsx'
import React from 'react'

import type { Boat } from '@/payload-types'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { Card } from '../../components/Card'

export type RelatedBoatsProps = {
  className?: string
  docs?: Boat[]
  introContent?: DefaultTypedEditorState
}

export const RelatedBoats: React.FC<RelatedBoatsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="boat" showCategories />
        })}
      </div>
    </div>
  )
}
