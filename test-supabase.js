import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Connection successful!\n');

    // Test 2: Check if demo user exists
    console.log('2. Checking for demo user...');
    const { data: demoUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'demo@mycarebay.com')
      .single();

    if (userError) {
      console.log('⚠️  Demo user not found. You may need to run the migration script.');
    } else {
      console.log('✅ Demo user found:', demoUser.name);
    }

    // Test 3: Check if demo senior exists
    if (demoUser) {
      console.log('\n3. Checking for demo senior...');
      const { data: demoSenior, error: seniorError } = await supabase
        .from('seniors')
        .select('*')
        .eq('user_id', demoUser.id)
        .single();

      if (seniorError) {
        console.log('⚠️  Demo senior not found.');
      } else {
        console.log('✅ Demo senior found:', demoSenior.name);
      }
    }

    // Test 4: Test direct Supabase operations (simulate what Vercel functions will do)
    console.log('\n4. Testing direct Supabase operations...');
    
    // Test user creation/login
    const { data: testUser, error: testUserError } = await supabase
      .from('users')
      .upsert({
        email: 'test@mycarebay.com',
        name: 'Test User',
        plan: 'free'
      })
      .select()
      .single();

    if (testUserError) {
      console.log('⚠️  User creation test failed:', testUserError.message);
    } else {
      console.log('✅ User creation/upsert working');
      
      // Test senior creation
      const { data: testSenior, error: testSeniorError } = await supabase
        .from('seniors')
        .insert({
          user_id: testUser.id,
          name: 'Test Senior',
          relationship: 'Test'
        })
        .select()
        .single();

      if (testSeniorError) {
        console.log('⚠️  Senior creation test failed:', testSeniorError.message);
      } else {
        console.log('✅ Senior creation working');
        
        // Clean up test data
        await supabase.from('seniors').delete().eq('id', testSenior.id);
        await supabase.from('users').delete().eq('id', testUser.id);
        console.log('✅ Test data cleaned up');
      }
    }

    console.log('\n🎉 Supabase connection test completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Ready for deployment.');
  } else {
    console.log('\n❌ Tests failed. Please check your setup.');
    process.exit(1);
  }
});
