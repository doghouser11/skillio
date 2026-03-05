// Register test account for Kirchev
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_SECRET_KEY' // Using service key for admin registration

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestAccount() {
  console.log('👤 Creating test account for development...')
  
  try {
    // Create user with confirmed email (using service key)
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'kirchev@test.com', // Test email
      password: 'devpass123',
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        full_name: 'Kirchev Test Account'
      }
    })
    
    if (error) {
      console.error('❌ Admin create error:', error.message)
      return
    }
    
    console.log('✅ Test account created successfully!')
    console.log('📧 Email: kirchev@test.com')
    console.log('🔑 Password: devpass123')
    console.log('👑 Role: admin')
    console.log('🆔 User ID:', data.user?.id)
    
    // Also create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: 'kirchev@test.com',
        full_name: 'Kirchev Test Account',
        role: 'admin',
        verified: true
      })
    
    if (profileError) {
      console.log('⚠️  Profile creation failed (expected if table not exists):', profileError.message)
    } else {
      console.log('✅ User profile created!')
    }
    
  } catch (err) {
    console.error('❌ Exception:', err.message)
  }
}

createTestAccount()