// Quick test of Supabase API
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'sb_publishable_vJUOB5ix4JtsU22Sfp2SnQ_nEvNMjtJ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAPI() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('skillio')
      .select('id, name, address')
      .limit(3)

    if (error) {
      console.error('❌ Supabase error:', error)
      return
    }

    console.log('✅ Success! Found', data.length, 'schools:')
    data.forEach(school => {
      console.log(`  - ${school.name} | ${school.address}`)
    })
    
  } catch (err) {
    console.error('❌ Exception:', err.message)
  }
}

testAPI()