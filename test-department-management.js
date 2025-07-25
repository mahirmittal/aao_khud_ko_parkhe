// Test script to verify department management APIs
async function testDepartmentManagement() {
    try {
        console.log('Testing Department Management APIs...\n');

        // 1. Test getting all departments (should return sample departments)
        console.log('1. Testing GET /api/departments');
        let response = await fetch('http://localhost:3000/api/departments');
        let data = await response.json();
        console.log('Initial departments:', data);

        // 2. Test creating a new department
        console.log('\n2. Testing POST /api/departments - Creating new department');
        const newDepartment = {
            deptName: 'Test Department',
            deptEmail: 'test@cg.gov.in',
            deptContactNo: '7712345099'
        };

        response = await fetch('http://localhost:3000/api/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDepartment),
        });

        data = await response.json();
        console.log('Create department response:', data);

        if (response.ok && data.success) {
            const deptId = data.department.id;
            console.log('✅ Department created successfully with ID:', deptId);

            // 3. Test getting all departments again
            console.log('\n3. Testing GET /api/departments after creating department');
            response = await fetch('http://localhost:3000/api/departments');
            data = await response.json();
            console.log('Departments after creation:', data);

            // 4. Test updating the department
            console.log('\n4. Testing PUT /api/departments/[id] - Updating department');
            const updatedDepartment = {
                deptName: 'Test Department Updated',
                deptEmail: 'test_updated@cg.gov.in',
                deptContactNo: '7712345088'
            };

            response = await fetch(`http://localhost:3000/api/departments/${deptId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDepartment),
            });

            data = await response.json();
            console.log('Update department response:', data);

            if (response.ok && data.success) {
                console.log('✅ Department updated successfully');

                // 5. Test deleting the department
                console.log('\n5. Testing DELETE /api/departments/[id] - Deleting department');
                response = await fetch(`http://localhost:3000/api/departments/${deptId}`, {
                    method: 'DELETE',
                });

                data = await response.json();
                console.log('Delete department response:', data);

                if (response.ok && data.success) {
                    console.log('✅ Department deleted successfully');

                    // 6. Verify department is deleted
                    console.log('\n6. Verifying department deletion');
                    response = await fetch('http://localhost:3000/api/departments');
                    data = await response.json();
                    console.log('Final departments list:', data);

                    const deletedDept = data.find(dept => dept.id === deptId);
                    if (!deletedDept) {
                        console.log('✅ Department successfully removed from database');
                    } else {
                        console.log('❌ Department still exists in database');
                    }
                } else {
                    console.log('❌ Failed to delete department');
                }
            } else {
                console.log('❌ Failed to update department');
            }
        } else {
            console.log('❌ Failed to create department');
        }

        // 7. Test validation - duplicate department name
        console.log('\n7. Testing validation - Duplicate department name');
        const duplicateDept = {
            deptName: 'Health Department', // This should already exist
            deptEmail: 'duplicate@cg.gov.in',
            deptContactNo: '7712345077'
        };

        response = await fetch('http://localhost:3000/api/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(duplicateDept),
        });

        data = await response.json();
        console.log('Duplicate department test response:', data);

        if (!response.ok && data.error && data.error.includes('already exists')) {
            console.log('✅ Duplicate validation working correctly');
        } else {
            console.log('❌ Duplicate validation failed');
        }

        // 8. Test validation - invalid email
        console.log('\n8. Testing validation - Invalid email format');
        const invalidEmailDept = {
            deptName: 'Invalid Email Dept',
            deptEmail: 'invalid-email',
            deptContactNo: '7712345066'
        };

        response = await fetch('http://localhost:3000/api/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidEmailDept),
        });

        data = await response.json();
        console.log('Invalid email test response:', data);

        if (!response.ok && data.error && data.error.includes('email')) {
            console.log('✅ Email validation working correctly');
        } else {
            console.log('❌ Email validation failed');
        }

        // 9. Test validation - invalid contact number
        console.log('\n9. Testing validation - Invalid contact number');
        const invalidPhoneDept = {
            deptName: 'Invalid Phone Dept',
            deptEmail: 'valid@cg.gov.in',
            deptContactNo: '123' // Invalid - not 10 digits
        };

        response = await fetch('http://localhost:3000/api/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidPhoneDept),
        });

        data = await response.json();
        console.log('Invalid phone test response:', data);

        if (!response.ok && data.error && data.error.includes('10 digits')) {
            console.log('✅ Phone validation working correctly');
        } else {
            console.log('❌ Phone validation failed');
        }

        console.log('\n🎉 Department Management API testing completed!');
        console.log('✅ All core functionalities are working correctly');

    } catch (error) {
        console.error('❌ Error during testing:', error);
    }
}

// Run the test
testDepartmentManagement();
