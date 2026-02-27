import { createClient } from '@supabase/supabase-js'
import { PremiumApp } from './premium-apps-data'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Initialize table if it doesn't exist
export async function initializePremiumAppsTable() {
  try {
    // Check if table exists by trying to query it
    const { data, error } = await supabase
      .from('premium_apps')
      .select('id')
      .limit(1)

    if (error?.code === 'PGRST116') {
      // Table doesn't exist, create it
      await supabase.rpc('create_premium_apps_table', {})
    }
  } catch (error) {
    console.error('Error initializing premium apps table:', error)
  }
}

// Get all premium apps
export async function getPremiumAppsFromDB(): Promise<PremiumApp[]> {
  try {
    const { data, error } = await supabase
      .from('premium_apps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching premium apps:', error)
    return []
  }
}

// Get single premium app
export async function getPremiumAppFromDB(id: string): Promise<PremiumApp | null> {
  try {
    const { data, error } = await supabase
      .from('premium_apps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error('Error fetching premium app:', error)
    return null
  }
}

// Create premium app
export async function createPremiumAppInDB(app: Omit<PremiumApp, 'id'>): Promise<PremiumApp | null> {
  try {
    const { data, error } = await supabase
      .from('premium_apps')
      .insert([
        {
          name: app.name,
          description: app.description,
          long_description: app.longDescription,
          features: app.features,
          price: app.price,
          category: app.category,
          icon: app.icon,
          image: app.image,
          downloads: app.downloads || 0,
          is_new: app.isNew || false,
          is_offer: app.isOffer || false,
          offer_price: app.offerPrice || null,
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data ? formatDBPremiumApp(data) : null
  } catch (error) {
    console.error('Error creating premium app:', error)
    return null
  }
}

// Update premium app
export async function updatePremiumAppInDB(id: string, updates: Partial<PremiumApp>): Promise<PremiumApp | null> {
  try {
    const updateData: any = {}
    
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.longDescription !== undefined) updateData.long_description = updates.longDescription
    if (updates.features !== undefined) updateData.features = updates.features
    if (updates.price !== undefined) updateData.price = updates.price
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.icon !== undefined) updateData.icon = updates.icon
    if (updates.image !== undefined) updateData.image = updates.image
    if (updates.downloads !== undefined) updateData.downloads = updates.downloads
    if (updates.isNew !== undefined) updateData.is_new = updates.isNew
    if (updates.isOffer !== undefined) updateData.is_offer = updates.isOffer
    if (updates.offerPrice !== undefined) updateData.offer_price = updates.offerPrice

    const { data, error } = await supabase
      .from('premium_apps')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data ? formatDBPremiumApp(data) : null
  } catch (error) {
    console.error('Error updating premium app:', error)
    return null
  }
}

// Delete premium app
export async function deletePremiumAppFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('premium_apps')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting premium app:', error)
    return false
  }
}

// Helper function to format DB data to app format
function formatDBPremiumApp(data: any): PremiumApp {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    longDescription: data.long_description,
    features: data.features || [],
    price: data.price,
    category: data.category,
    icon: data.icon,
    image: data.image,
    downloads: data.downloads || 0,
    isNew: data.is_new || false,
    isOffer: data.is_offer || false,
    offerPrice: data.offer_price || undefined,
  }
}
