// Complete database setup with service key
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_SECRET_KEY'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🗄️ Setting up complete Skillio database...')
  
  try {
    // Read the SQL file
    const sql = fs.readFileSync('../../full_database_setup.sql', 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.includes('SELECT ') && statement.includes('result')) {
        console.log(`✅ Progress: ${statement}`)
        continue
      }
      
      try {
        // Use the raw SQL execution via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sql: statement + ';'
          })
        })
        
        if (!response.ok) {
          // Try alternative approach - direct query
          const { error } = await supabase.rpc('exec', { 
            sql: statement + ';' 
          })
          
          if (error && !error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i+1}/${statements.length}: ${error.message}`)
            errorCount++
          } else {
            successCount++
          }
        } else {
          successCount++
        }
        
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i+1}/${statements.length}: ${err.message}`)
          errorCount++
        } else {
          successCount++
        }
      }
    }
    
    console.log(`\n📊 Results:`)
    console.log(`✅ Success: ${successCount}`)
    console.log(`⚠️  Warnings/Errors: ${errorCount}`)
    
    // Test if tables exist
    console.log('\n🔍 Verifying tables...')
    await testTables()
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

async function testTables() {
  const tables = ['user_profiles', 'schools', 'categories', 'activities', 'reviews', 'enrollments', 'admin_actions']
  
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
      console.log(`❌ ${table}: Table test failed`)
    }
  }
}

// Create admin user function
async function createAdmin(email, password) {
  console.log('\n👑 Creating admin user...')
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Kirchev Admin'
      }
    })
    
    if (error) {
      console.error('❌ Admin creation failed:', error.message)
      return null
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: 'Kirchev Admin',
        role: 'admin',
        verified: true
      })
    
    if (profileError) {
      console.log('⚠️  Profile creation:', profileError.message)
    } else {
      console.log('✅ Admin profile created!')
    }
    
    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`🆔 User ID: ${data.user.id}`)
    
    return data.user.id
    
  } catch (err) {
    console.error('❌ Admin creation exception:', err.message)
    return null
  }
}

// Run setup
async function main() {
  await setupDatabase()
  
  // Ask for admin credentials
  console.log('\n👑 Ready to create your admin account!')
  console.log('💡 Use your REAL email and password that you will remember.')
  console.log('📝 Example: createAdmin("your-email@gmail.com", "your-secure-password")')
  console.log('\n🔧 Uncomment and modify the line below with your credentials:')
  console.log('// await createAdmin("your-email@gmail.com", "your-password")')
  
  // CREATE KIRCHEV'S ADMIN ACCOUNT:
  await createAdmin("nikol_93_bg@proton.me", "KirchevAdmin2026!");
}

main().catch(console.error)