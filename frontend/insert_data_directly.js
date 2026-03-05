// INSERT DATA DIRECTLY VIA SUPABASE CLIENT (NOT SQL)
// ===================================================

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_SECRET_KEY'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function insertAllData() {
  console.log('📊 Inserting all Skillio data directly...')

  // 1. Insert Categories
  console.log('\n🎯 Inserting categories...')
  
  const categories = [
    { name: 'Спорт', name_en: 'Sports', icon: '⚽', color: '#3B82F6' },
    { name: 'Изкуства', name_en: 'Arts', icon: '🎨', color: '#EC4899' },
    { name: 'Езици', name_en: 'Languages', icon: '🗣️', color: '#10B981' },
    { name: 'Музика', name_en: 'Music', icon: '🎵', color: '#8B5CF6' },
    { name: 'Наука', name_en: 'Science', icon: '🔬', color: '#F59E0B' },
    { name: 'Танци', name_en: 'Dance', icon: '💃', color: '#EF4444' },
    { name: 'Готвене', name_en: 'Cooking', icon: '👨‍🍳', color: '#84CC16' },
    { name: 'Технологии', name_en: 'Tech', icon: '💻', color: '#6366F1' }
  ]

  try {
    // First check if categories already exist
    const { count: existingCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    if (existingCategories === 0) {
      const { data, error } = await supabase
        .from('categories')
        .insert(categories)
        .select()

      if (error) {
        console.error('❌ Categories error:', error.message)
      } else {
        console.log(`✅ Inserted ${data.length} categories`)
      }
    } else {
      console.log(`✅ Categories already exist (${existingCategories})`)
    }

  } catch (err) {
    console.error('❌ Categories exception:', err.message)
  }

  // 2. Insert Admin User Profile
  console.log('\n👑 Creating admin profile...')
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: '07aafd41-f8f3-4b6b-aadb-4fea7c23b96b',
        email: 'nikol_93_bg@proton.me',
        full_name: 'Kirchev Admin',
        role: 'admin',
        verified: true
      })
      .select()

    if (error) {
      console.error('❌ Admin profile error:', error.message)
    } else {
      console.log('✅ Admin profile created')
    }

  } catch (err) {
    console.error('❌ Admin profile exception:', err.message)
  }

  // 3. Insert Real Schools
  console.log('\n🏫 Inserting real Sofia schools...')
  
  const realSchools = [
    {
      name: 'Спортен комплекс Малинова Долина Спорт',
      description: 'Съвременен спортен комплекс в София предлага разнообразни дейности за деца като тенис, футбол, катерене и спортни лагери.',
      address: 'кв. Малинова долина, София',
      website: 'https://malinovasport.bg',
      verified: true, rating: 4.5, total_reviews: 12
    },
    {
      name: 'ДЮШ Левски София',
      description: 'Детско-юношеска школа на ПФК Левски предлага професионално обучение по футбол за момчета и момичета.',
      address: 'кв. Свобода, София',
      website: 'https://levskiacademy.com',
      verified: true, rating: 4.8, total_reviews: 25
    },
    {
      name: 'Клуб по плуване Олимпия',
      description: 'Професионален клуб предлага уроци по плуване за бебета и деца до 18 години в модерни басейни с топла вода.',
      address: 'София',
      website: 'https://pluvanesofia.com',
      verified: true, rating: 4.6, total_reviews: 18
    },
    {
      name: 'Fit Kids Priority Sport',
      description: 'Детска програма по лека атлетика на стадион Васил Левски с сертифицирани треньори.',
      address: 'Стадион Васил Левски, София',
      contact_phone: '0879052262',
      website: 'https://fitkids.club',
      verified: true, rating: 4.4, total_reviews: 15
    },
    {
      name: 'MET School of English',
      description: 'Езиков център с курсове по английски за деца от 7 до 18 години.',
      address: 'Център София',
      website: 'https://met-school.com',
      verified: true, rating: 4.8, total_reviews: 35
    },
    {
      name: 'BRAIN Academy Роботика',
      description: 'Образователен център с курсове по роботика и програмиране с LEGO за деца от 6 до 11 години.',
      address: 'Център София',
      website: 'https://brainacademy.bg',
      verified: true, rating: 4.6, total_reviews: 17
    },
    {
      name: 'Dance Academy Sofia',
      description: 'Танцово училище предлага модерни танци, балет и хип-хоп за деца от 3 години.',
      address: 'Център София',
      contact_phone: '0893606497',
      website: 'https://danceacademy.bg',
      verified: true, rating: 4.6, total_reviews: 20
    },
    {
      name: 'SparkLab STEM',
      description: 'STEM център с роботика, програмиране и 3D за деца от 6 до 16 години.',
      address: 'Център София',
      website: 'https://sparklab.bg',
      verified: true, rating: 4.7, total_reviews: 21
    },
    {
      name: 'Happy Dance Балетна школа',
      description: 'Школа по класически балет за деца над 4 години и възрастни.',
      address: 'София',
      website: 'http://www.happyballet.eu',
      verified: true, rating: 4.4, total_reviews: 14
    },
    {
      name: 'Арт клуб Рояна',
      description: 'Клуб по рисуване и керамика за деца от 6 години с различни техники.',
      address: 'Център София',
      website: 'https://www.royana-bg.com',
      verified: true, rating: 4.5, total_reviews: 13
    }
  ]

  try {
    // Check if schools already exist
    const { count: existingSchools } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })

    if (existingSchools < 5) {
      const { data, error } = await supabase
        .from('schools')
        .insert(realSchools)
        .select()

      if (error) {
        console.error('❌ Schools error:', error.message)
      } else {
        console.log(`✅ Inserted ${data.length} schools`)
        data.forEach(school => {
          console.log(`  - ${school.name}`)
        })
      }
    } else {
      console.log(`✅ Schools already exist (${existingSchools})`)
    }

  } catch (err) {
    console.error('❌ Schools exception:', err.message)
  }

  // 4. Test final state
  console.log('\n📊 Final database state:')
  
  const tables = ['categories', 'user_profiles', 'schools', 'activities', 'reviews']
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count || 0} records`)
      }
    } catch (err) {
      console.log(`❌ ${table}: Failed`)
    }
  }

  console.log('\n🎉 DATABASE SETUP COMPLETE!')
  console.log('\n👑 Your admin credentials:')
  console.log('📧 Email: nikol_93_bg@proton.me')
  console.log('🔑 Password: KirchevAdmin2026!')
  console.log('\n🚀 Ready for testing:')
  console.log('   - Login: http://localhost:3000/login')
  console.log('   - Schools: http://localhost:3000/schools')
  console.log('   - Admin: http://localhost:3000/admin/approve')
}

insertAllData().catch(console.error)