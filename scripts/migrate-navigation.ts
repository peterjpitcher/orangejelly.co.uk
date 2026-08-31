import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const navigationContent = {
  _type: 'navigation',
  _id: 'navigation',
  title: 'Main Navigation',
  mainMenu: [
    {
      label: 'Home',
      href: '/',
      order: 1,
      external: false,
    },
    {
      label: 'Services',
      href: '/services',
      order: 2,
      external: false,
    },
    {
      label: "Licensee's Guide",
      href: '/guides',
      order: 3,
      external: false,
    },
    {
      label: 'Success Stories',
      href: '/results',
      order: 4,
      external: false,
    },
    {
      label: 'About',
      href: '/about',
      order: 5,
      external: false,
    },
    {
      label: 'Contact',
      href: '/contact',
      order: 6,
      external: false,
    },
  ],
  // Mobile menu uses the same items as main menu by default
  // If you want different mobile menu items, populate this array
  mobileMenu: [],
  whatsappCta: {
    enabled: true,
    text: "Hi Peter, I'd like to chat about Orange Jelly",
    phoneNumber: '447990587315',
    showInDesktop: true,
    showInMobile: true,
  },
}

async function migrateNavigation() {
  console.log('Starting navigation migration...')

  try {
    // First check if navigation document exists
    const existingDoc = await client.fetch('*[_type == "navigation" && _id == "navigation"][0]')
    
    if (existingDoc) {
      console.log('Found existing navigation document')
      
      // Delete existing document
      try {
        await client.delete('navigation')
        console.log('Deleted existing navigation document')
      } catch (error) {
        console.log('Error deleting existing document:', error)
      }
    } else {
      console.log('No existing navigation document found')
    }

    // Create new navigation document
    console.log('Creating navigation document...')
    const result = await client.create(navigationContent)
    console.log('Created navigation document with ID:', result._id)

    // Verify the document was created
    const verifyDoc = await client.fetch('*[_type == "navigation" && _id == "navigation"][0]')
    if (verifyDoc) {
      console.log('✅ Navigation migration complete!')
      console.log('Navigation structure:')
      console.log('- Main menu items:', verifyDoc.mainMenu?.length || 0)
      console.log('- Mobile menu items:', verifyDoc.mobileMenu?.length || 0)
      console.log('- WhatsApp CTA enabled:', verifyDoc.whatsappCta?.enabled || false)
    } else {
      console.error('❌ Failed to verify navigation document creation')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error migrating navigation:', error)
    process.exit(1)
  }
}

// Run the migration
migrateNavigation()