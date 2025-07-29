const { MongoClient } = require('mongodb')

// MongoDB connection URI
const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin'

async function testConnection() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        console.log('🔗 Testing MongoDB connection...')
        await client.connect()
        console.log('✅ Connected to MongoDB successfully!')
        
        const db = client.db()
        
        // List all collections
        const collections = await db.listCollections().toArray()
        console.log('\n📁 Existing collections:')
        if (collections.length === 0) {
            console.log('   No collections found (database is empty)')
        } else {
            collections.forEach(col => {
                console.log(`   - ${col.name}`)
            })
        }
        
        // Check for existing users
        if (collections.some(col => col.name === 'users' || col.name === 'admins' || col.name === 'adminC')) {
            console.log('\n👥 Checking for existing users...')
            
            const userCollections = ['users', 'admins', 'adminC']
            for (const collectionName of userCollections) {
                if (collections.some(col => col.name === collectionName)) {
                    const collection = db.collection(collectionName)
                    const userCount = await collection.countDocuments()
                    if (userCount > 0) {
                        console.log(`   - ${collectionName}: ${userCount} users found`)
                        const users = await collection.find({}, { projection: { username: 1, role: 1, email: 1 } }).toArray()
                        users.forEach(user => {
                            console.log(`     • ${user.username} (${user.role || 'no role'}) - ${user.email || 'no email'}`)
                        })
                    } else {
                        console.log(`   - ${collectionName}: empty`)
                    }
                }
            }
        }
        
        console.log('\n🎯 Connection test completed successfully!')
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message)
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure MongoDB is running on localhost:27017')
            console.error('   You can start MongoDB with: mongod --dbpath /data/db')
        }
    } finally {
        await client.close()
        console.log('🔌 Connection closed')
    }
}

// Run the test
testConnection()
