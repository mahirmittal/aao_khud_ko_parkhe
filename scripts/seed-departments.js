const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function createDepartments() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('cgPortalFeedback');
        const collection = db.collection('departments');

        // Clear existing departments
        await collection.deleteMany({});
        console.log('Cleared existing departments');

        // Insert test departments with correct structure
        const departments = [
            {
                name: 'Health Department',
                description: 'Manages public health services and medical facilities',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Finance Department',
                description: 'Handles financial planning, budgeting, and revenue management',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Tax Department',
                description: 'Manages tax collection and revenue administration',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Education Department',
                description: 'Oversees educational policies and school administration',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Transportation Department',
                description: 'Manages public transportation and infrastructure',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await collection.insertMany(departments);
        console.log(`${result.insertedCount} departments created successfully`);
        
        // Verify the departments
        const insertedDepts = await collection.find({}).toArray();
        console.log('Inserted departments:');
        insertedDepts.forEach(dept => {
            console.log(`- ${dept.name}: ${dept.description}`);
        });

    } catch (error) {
        console.error('Error creating departments:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

createDepartments();
