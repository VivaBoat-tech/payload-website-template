import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  timestamps: true,
  auth: true,
  defaultPopulate: {
    name: true,
    image: true,
    // meta: {
    //   image: true,
    //   description: true,
    // },
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      required: false,
    },
    {
      label: 'Role',
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Customer',
          value: 'customer',
        },
        {
          label: 'Partner',
          value: 'partner',
        },
        {
          label: 'Administrator',
          value: 'admin',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [],
          label: 'Personal data',
        },
        {
          fields: [
            {
              name: 'relatedBoats',
              type: 'relationship',
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'boats',
            },
          ],
          label: 'Related Boats',
        },
      ],
    },
  ],
}
