// Test Supabase auth registration
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hulqbgfllkxjfnmgjupq.supabase.co'
const supabaseKey = 'sb_publishable_vJUOB5ix4JtsU22Sfp2SnQ_nEvNMjtJ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log('🔐 Testing Supabase auth registration...')
  
  const testEmail = 'testuser123@gmail.com'
  const testPassword = 'testpass123'
  
  try {
    // Try to register
    console.log('📧 Attempting to register:', testEmail)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          role: 'parent'
        }
      }
    })
    
    if (error) {
      console.error('❌ Registration error:', error.message)
      
      if (error.message.includes('confirm')) {
        console.log('📧 Email confirmation may be required')
      }
      
      return
    }
    
    console.log('✅ Registration successful!')
    console.log('User ID:', data.user?.id)
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
    console.log('Session:', data.session ? 'Created' : 'None')
    
    if (!data.session) {
      console.log('📧 Check your email for confirmation link')
    }
    
  } catch (err) {
    console.error('❌ Exception:', err.message)
  }
}

testAuth()