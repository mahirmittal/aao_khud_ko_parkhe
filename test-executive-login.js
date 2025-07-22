// Test script to verify Executive login authentication
async function testExecutiveLogin() {
  try {
    console.log('Testing Executive Login Authentication...\n');

    // Test 1: Valid credentials for Executive user
    console.log('1. Testing valid Executive credentials');
    let response = await fetch('http://localhost:3000/api/Executive/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Executive1',
        password: 'exec123'
      }),
    });

    let data = await response.json();
    console.log('Executive login response:', data);

    if (response.ok && data.success) {
      console.log('✅ Executive login test PASSED');
    } else {
      console.log('❌ Executive login test FAILED');
    }

    // Test 2: Valid credentials for manager user
    console.log('\n2. Testing valid manager credentials');
    response = await fetch('http://localhost:3000/api/Executive/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'manager1',
        password: 'manager123'
      }),
    });

    data = await response.json();
    console.log('Manager login response:', data);

    if (response.ok && data.success) {
      console.log('✅ Manager login test PASSED');
    } else {
      console.log('❌ Manager login test FAILED');
    }

    // Test 3: Try admin user (should be rejected)
    console.log('\n3. Testing admin user access (should be rejected)');
    response = await fetch('http://localhost:3000/api/Executive/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin1234'
      }),
    });

    data = await response.json();
    console.log('Admin access attempt response:', data);

    if (response.status === 403 && data.error.includes('Admin users cannot login here')) {
      console.log('✅ Admin access rejection test PASSED');
    } else {
      console.log('❌ Admin access rejection test FAILED');
    }

    // Test 4: Invalid credentials
    console.log('\n4. Testing invalid credentials');
    response = await fetch('http://localhost:3000/api/Executive/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'wronguser',
        password: 'wrongpass'
      }),
    });

    data = await response.json();
    console.log('Invalid credentials response:', data);

    if (response.status === 401 && data.error === 'Invalid credentials') {
      console.log('✅ Invalid credentials test PASSED');
    } else {
      console.log('❌ Invalid credentials test FAILED');
    }

    // Test 5: Inactive user
    console.log('\n5. Testing inactive user access');
    response = await fetch('http://localhost:3000/api/Executive/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Executive1',
        password: 'op123'
      }),
    });

    data = await response.json();
    console.log('Inactive user response:', data);

    if (response.status === 401 && data.error.includes('Account is inactive')) {
      console.log('✅ Inactive user rejection test PASSED');
    } else {
      console.log('❌ Inactive user rejection test FAILED');
    }

    console.log('\n🎉 Executive login authentication tests completed!');

  } catch (error) {
    console.log('❌ Executive login test failed with exception');
    console.error('Error:', error);
  }
}

// Run the test
testExecutiveLogin();
