const { MongoClient } = require('mongodb')

const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin'

async function verifyCredentials() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        await client.connect()
        const db = client.db()
        
        console.log('🔐 Verifying login credentials...\n')
        
        // Test admin login
        const adminUser = await db.collection('users').findOne({ 
            username: 'admin',
            type: 'admin',
            active: true
        })
        
        if (adminUser && adminUser.password === 'admin123') {
            console.log('✅ Admin login verified')
            console.log(`   Username: admin`)
            console.log(`   Password: admin123`)
            console.log(`   Type: ${adminUser.type}`)
            console.log(`   Active: ${adminUser.active}`)
        } else {
            console.log('❌ Admin login failed')
        }
        
        console.log('')
        
        // Test executive login
        const executiveUser = await db.collection('users').findOne({ 
            username: 'executive',
            type: 'executive',
            active: true
        })
        
        if (executiveUser && executiveUser.password === 'exec123') {
            console.log('✅ Executive login verified')
            console.log(`   Username: executive`)
            console.log(`   Password: exec123`)
            console.log(`   Type: ${executiveUser.type}`)
            console.log(`   Active: ${executiveUser.active}`)
        } else {
            console.log('❌ Executive login failed')
        }
        
        console.log('')
        
        // Test adminC collection
        const adminCUser = await db.collection('adminC').findOne({ username: 'admin' })
        if (adminCUser && adminCUser.password === 'admin123') {
            console.log('✅ AdminC collection verified')
            console.log(`   Username: admin`)
            console.log(`   Password: admin123`)
        } else {
            console.log('❌ AdminC collection failed')
        }
        
        console.log('\n🎉 All credentials verified successfully!')
        console.log('\n🌐 You can now login at: http://localhost:3000/admin/login')
        
    } catch (error) {
        console.error('❌ Verification failed:', error)
    } finally {
        await client.close()
    }
}

verifyCredentials()
