// CREATE ADMIN USER SCRIPT
// =======================
// Creates admin user with specified credentials

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // 1. Sign up the user  
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'nikol_93_bg@proton.me',
      password: 'KirchevAdmin2026!',
      options: {
        data: {
          role: 'admin',
          full_name: 'Kirchev Admin'
        }
      }
    });

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return;
    }

    console.log('✅ Admin user created:', authData.user?.email);
    console.log('📧 Check email for verification link!');

    // 2. Add to users table (will happen via trigger or manually)
    if (authData.user) {
      console.log('User ID:', authData.user.id);
      console.log('Role: admin');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();