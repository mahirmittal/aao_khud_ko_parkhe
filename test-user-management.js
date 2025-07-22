// Test script to verify user management APIs
async function testUserManagement() {
  try {
    console.log('Testing User Management APIs...\n');

    // 1. Test getting all users (should be empty initially)
    console.log('1. Testing GET /api/users');
    let response = await fetch('http://localhost:3000/api/users');
    let data = await response.json();
    console.log('Initial users:', data);

    // 2. Test creating a new user
    console.log('\n2. Testing POST /api/users - Creating new user');
    const newUser = {
      username: 'testuser',
      password: 'testpass123',
      type: 'Executive',
      active: true
    };

    response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    data = await response.json();
    console.log('Create user response:', data);

    if (response.ok && data.success) {
      const userId = data.user.id;
      console.log('✅ User created successfully with ID:', userId);

      // 3. Test getting all users again
      console.log('\n3. Testing GET /api/users after creating user');
      response = await fetch('http://localhost:3000/api/users');
      data = await response.json();
      console.log('Users after creation:', data);

      // 4. Test updating the user
      console.log('\n4. Testing PUT /api/users/[id] - Updating user');
      const updatedUser = {
        username: 'testuser_updated',
        password: 'newpassword123',
        type: 'manager',
        active: false
      };

      response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      data = await response.json();
      console.log('Update user response:', data);

      if (response.ok && data.success) {
        console.log('✅ User updated successfully');

        // 5. Test deleting the user
        console.log('\n5. Testing DELETE /api/users/[id] - Deleting user');
        response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE',
        });

        data = await response.json();
        console.log('Delete user response:', data);

        if (response.ok && data.success) {
          console.log('✅ User deleted successfully');

          // 6. Final check - get all users (should be empty again)
          console.log('\n6. Final check - GET /api/users after deletion');
          response = await fetch('http://localhost:3000/api/users');
          data = await response.json();
          console.log('Final users list:', data);

          console.log('\n🎉 All user management tests passed!');
        } else {
          console.log('❌ Delete user failed');
        }
      } else {
        console.log('❌ Update user failed');
      }
    } else {
      console.log('❌ Create user failed');
    }

  } catch (error) {
    console.log('❌ User management test failed with exception');
    console.error('Error:', error);
  }
}

// Test duplicate username scenario
async function testDuplicateUsername() {
  try {
    console.log('\n\nTesting duplicate username scenario...');

    const user1 = {
      username: 'duplicate_test',
      password: 'pass1',
      type: 'admin',
      active: true
    };

    // Create first user
    let response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user1),
    });

    let data = await response.json();
    console.log('First user created:', data.success);

    if (data.success) {
      const userId = data.user.id;

      // Try to create second user with same username
      response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user1),
      });

      data = await response.json();
      console.log('Duplicate username response:', data);

      if (response.status === 409 && data.error === 'Username already exists') {
        console.log('✅ Duplicate username correctly rejected');
      } else {
        console.log('❌ Duplicate username not handled properly');
      }

      // Clean up
      await fetch(`http://localhost:3000/api/users/${userId}`, { method: 'DELETE' });
    }

  } catch (error) {
    console.error('Duplicate username test error:', error);
  }
}

// Run tests
testUserManagement().then(() => {
  testDuplicateUsername();
});
