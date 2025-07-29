const { MongoClient } = require('mongodb')

// MongoDB connection URI
const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin'

async function seedUsersCorrect() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        console.log('🔗 Connecting to MongoDB...')
        await client.connect()
        console.log('✅ Connected to MongoDB successfully!')
        
        const db = client.db()
        
        // Work with users collection (follows schema validation)
        const usersCollection = db.collection('users')
        
        // Check if admin user already exists
        const existingAdmin = await usersCollection.findOne({ 
            username: 'admin',
            type: 'admin' 
        })
        
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!')
            // Update existing admin password
            await usersCollection.updateOne(
                { username: 'admin', type: 'admin' },
                { 
                    $set: { 
                        password: 'admin123',
                        active: true,
                        updatedAt: new Date()
                    }
                }
            )
            console.log('✅ Admin password updated to: admin123')
        } else {
            // Create new admin user following the schema
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                type: 'admin',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            await usersCollection.insertOne(adminUser)
            console.log('✅ Admin user created successfully!')
        }
        
        // Check if executive user already exists
        const existingExecutive = await usersCollection.findOne({ 
            username: 'executive',
            type: 'executive' 
        })
        
        if (existingExecutive) {
            console.log('⚠️ Executive user already exists!')
            // Update existing executive password
            await usersCollection.updateOne(
                { username: 'executive', type: 'executive' },
                { 
                    $set: { 
                        password: 'exec123',
                        active: true,
                        updatedAt: new Date()
                    }
                }
            )
            console.log('✅ Executive password updated to: exec123')
        } else {
            // Create new executive user following the schema
            const executiveUser = {
                username: 'executive',
                password: 'exec123',
                type: 'executive',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            await usersCollection.insertOne(executiveUser)
            console.log('✅ Executive user created successfully!')
        }
        
        // Also update adminC collection for backward compatibility
        const adminCCollection = db.collection('adminC')
        
        const existingAdminC = await adminCCollection.findOne({ username: 'admin' })
        if (existingAdminC) {
            await adminCCollection.updateOne(
                { username: 'admin' },
                { $set: { password: 'admin123' } }
            )
            console.log('✅ AdminC collection updated')
        } else {
            await adminCCollection.insertOne({
                username: 'admin',
                password: 'admin123'
            })
            console.log('✅ AdminC collection seeded')
        }
        
        console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!')
        console.log('=' .repeat(60))
        console.log('📋 LOGIN CREDENTIALS:')
        console.log('=' .repeat(60))
        console.log('👑 ADMIN LOGIN:')
        console.log('   Username: admin')
        console.log('   Password: admin123')
        console.log('   Type: admin')
        console.log('')
        console.log('👤 EXECUTIVE LOGIN:')
        console.log('   Username: executive')
        console.log('   Password: exec123')
        console.log('   Type: executive')
        console.log('=' .repeat(60))
        console.log('⚠️  IMPORTANT: Change these passwords after first login!')
        console.log('🌐 Access your admin panel at: /admin/login')
        console.log('=' .repeat(60))
        
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure MongoDB is running on localhost:27017')
        }
        process.exit(1)
    } finally {
        await client.close()
        console.log('🔌 Database connection closed')
    }
}

// Run the seeding function
seedUsersCorrect()
