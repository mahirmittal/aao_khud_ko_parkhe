const { MongoClient } = require('mongodb')

// MongoDB connection URI
const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin'

async function seedUsers() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        console.log('🔗 Connecting to MongoDB...')
        await client.connect()
        console.log('✅ Connected to MongoDB successfully!')
        
        const db = client.db()
        
        // Check if users collection exists, if not create it
        const collections = await db.listCollections().toArray()
        const collectionNames = collections.map(col => col.name)
        
        let usersCollection
        if (collectionNames.includes('users')) {
            usersCollection = db.collection('users')
            console.log('📁 Using existing "users" collection')
        } else if (collectionNames.includes('admins')) {
            usersCollection = db.collection('admins')
            console.log('📁 Using existing "admins" collection')
        } else {
            usersCollection = db.collection('users')
            console.log('📁 Creating new "users" collection')
        }
        
        // Check if admin already exists
        const existingAdmin = await usersCollection.findOne({ username: 'admin' })
        
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!')
            console.log('Existing admin username:', existingAdmin.username)
            
            // Update existing admin if needed
            await usersCollection.updateOne(
                { username: 'admin' },
                { 
                    $set: { 
                        password: 'admin123',
                        isActive: true,
                        lastUpdated: new Date()
                    }
                }
            )
            console.log('✅ Admin password updated to: admin123')
        } else {
            // Create new admin user
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                email: 'admin@cgportal.gov.in',
                role: 'admin',
                permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
                createdAt: new Date(),
                isActive: true,
                loginAttempts: 0,
                lastLogin: null
            }
            
            await usersCollection.insertOne(adminUser)
            console.log('✅ Admin user created successfully!')
        }
        
        // Check if executive already exists
        const existingExecutive = await usersCollection.findOne({ username: 'executive' })
        
        if (existingExecutive) {
            console.log('⚠️ Executive user already exists!')
            
            // Update existing executive if needed
            await usersCollection.updateOne(
                { username: 'executive' },
                { 
                    $set: { 
                        password: 'exec123',
                        isActive: true,
                        lastUpdated: new Date()
                    }
                }
            )
            console.log('✅ Executive password updated to: exec123')
        } else {
            // Create new executive user
            const executiveUser = {
                username: 'executive',
                password: 'exec123',
                email: 'executive@cgportal.gov.in',
                role: 'executive',
                permissions: ['read', 'write', 'view_reports'],
                createdAt: new Date(),
                isActive: true,
                loginAttempts: 0,
                lastLogin: null
            }
            
            await usersCollection.insertOne(executiveUser)
            console.log('✅ Executive user created successfully!')
        }
        
        // Create feedback categories if they don't exist
        const categoriesCollection = db.collection('categories')
        const categoriesCount = await categoriesCollection.countDocuments()
        
        if (categoriesCount === 0) {
            const categories = [
                {
                    name: 'General Feedback',
                    description: 'General feedback and suggestions',
                    isActive: true,
                    createdAt: new Date()
                },
                {
                    name: 'Technical Issues',
                    description: 'Technical problems and bugs',
                    isActive: true,
                    createdAt: new Date()
                },
                {
                    name: 'Service Quality',
                    description: 'Government service quality feedback',
                    isActive: true,
                    createdAt: new Date()
                },
                {
                    name: 'Complaints',
                    description: 'Complaints and grievances',
                    isActive: true,
                    createdAt: new Date()
                }
            ]
            
            await categoriesCollection.insertMany(categories)
            console.log('✅ Feedback categories created!')
        } else {
            console.log('📂 Feedback categories already exist')
        }
        
        // Create system settings
        const settingsCollection = db.collection('settings')
        const settingsCount = await settingsCollection.countDocuments()
        
        if (settingsCount === 0) {
            const settings = [
                {
                    key: 'site_title',
                    value: 'CG Portal Feedback System',
                    type: 'string',
                    createdAt: new Date()
                },
                {
                    key: 'max_feedback_length',
                    value: 1000,
                    type: 'number',
                    createdAt: new Date()
                },
                {
                    key: 'auto_approve_feedback',
                    value: false,
                    type: 'boolean',
                    createdAt: new Date()
                },
                {
                    key: 'email_notifications',
                    value: true,
                    type: 'boolean',
                    createdAt: new Date()
                }
            ]
            
            await settingsCollection.insertMany(settings)
            console.log('✅ System settings created!')
        } else {
            console.log('⚙️ System settings already exist')
        }
        
        console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!')
        console.log('=' .repeat(60))
        console.log('📋 LOGIN CREDENTIALS:')
        console.log('=' .repeat(60))
        console.log('👑 ADMIN LOGIN:')
        console.log('   Username: admin')
        console.log('   Password: admin123')
        console.log('   Email: admin@cgportal.gov.in')
        console.log('')
        console.log('👤 EXECUTIVE LOGIN:')
        console.log('   Username: executive')
        console.log('   Password: exec123')
        console.log('   Email: executive@cgportal.gov.in')
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
seedUsers()
