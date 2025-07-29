const { MongoClient } = require('mongodb')

// MongoDB connection URI
const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin'

async function inspectSchema() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        console.log('🔍 Inspecting database schema...')
        await client.connect()
        
        const db = client.db()
        
        // Get collection info to see validation rules
        const collections = await db.listCollections().toArray()
        
        console.log('\n📋 Collection Details:')
        for (const collection of collections) {
            console.log(`\n📁 Collection: ${collection.name}`)
            if (collection.options && collection.options.validator) {
                console.log('   Validation Rules:', JSON.stringify(collection.options.validator, null, 2))
            }
            
            // Get a sample document to understand the structure
            const coll = db.collection(collection.name)
            const sampleDoc = await coll.findOne()
            if (sampleDoc) {
                console.log('   Sample Document Structure:')
                Object.keys(sampleDoc).forEach(key => {
                    console.log(`     - ${key}: ${typeof sampleDoc[key]} (${sampleDoc[key]})`)
                })
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await client.close()
    }
}

inspectSchema()
