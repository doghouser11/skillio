// Create Skillio table in Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_SECRET_KEY'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTable() {
  console.log('🗄️ Creating skillio table...')
  
  // Drop existing table
  const { error: dropError } = await supabase.rpc('exec_sql', {
    sql: 'DROP TABLE IF EXISTS skillio CASCADE;'
  })
  
  if (dropError) console.log('Drop warning:', dropError.message)
  
  // Create new table
  const { error: createError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE skillio (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        address TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        website TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  })
  
  if (createError) {
    console.error('❌ Create error:', createError)
    return
  }
  
  console.log('✅ Table created successfully!')
  
  // Test insert
  const { data, error } = await supabase
    .from('skillio')
    .insert([
      { 
        name: 'Test School', 
        description: 'A test school entry',
        address: 'Sofia, Bulgaria',
        contact_email: 'test@school.com',
        website: 'https://testschool.com'
      }
    ])
    .select()
  
  if (error) {
    console.error('❌ Insert error:', error)
    return
  }
  
  console.log('✅ Test data inserted:', data)
}

createTable().catch(console.error)