// Test script to add sample schools to Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_SECRET_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTestSchools() {
  console.log('🏫 Adding test schools to Supabase...')
  
  const testSchools = [
    {
      name: 'Детска академия "Слънце"',
      description: 'Образователен център за деца от 3 до 12 години. Предлагаме качествено обучение в приятна и безопасна среда.',
      address: 'София, ул. Витоша 15',
      contact_email: 'info@slunce-academy.bg',
      contact_phone: '+359888123456',
      website: 'https://slunce-academy.bg'
    },
    {
      name: 'Спортен клуб "Шампиони"',
      description: 'Спортни дейности за деца и юноши. Футбол, баскетбол, плуване и други спортове.',
      address: 'Пловдив, бул. Руски 22',
      contact_email: 'contact@champions.bg',
      contact_phone: '+359877654321',
      website: 'https://champions-sport.bg'
    },
    {
      name: 'Езикова школа "Полиглот"',
      description: 'Изучаване на английски, немски, френски и испански език за деца от 5 години.',
      address: 'Варна, ул. Княз Борис 88',
      contact_email: 'hello@polyglot.bg',
      contact_phone: '+359889777888',
      website: 'https://polyglot-languages.com'
    }
  ]

  try {
    const { data, error } = await supabase
      .from('skillio')
      .insert(testSchools)
      .select()

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('✅ Successfully added', data.length, 'test schools:')
    data.forEach(school => {
      console.log(`  - ${school.name} (${school.id})`)
    })

  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

// Also test fetching
async function testFetch() {
  console.log('\n🔍 Testing fetch schools...')
  
  try {
    const { data, error } = await supabase
      .from('skillio')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Fetch error:', error)
      return
    }

    console.log('✅ Found', data.length, 'schools:')
    data.forEach(school => {
      console.log(`  - ${school.name} | ${school.address} | ${school.website}`)
    })

  } catch (err) {
    console.error('❌ Fetch exception:', err)
  }
}

// Run both
addTestSchools()
  .then(() => testFetch())
  .catch(console.error)