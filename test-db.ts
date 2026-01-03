import dbConnect from './src/lib/db';
import mongoose from 'mongoose';

async function testConnection() {
    process.env.MONGODB_URI = 'mongodb+srv://folabas2_db_user:sRxmN1XpENaPF6px@cluster0.8ble8zg.mongodb.net/voting-system?retryWrites=true&w=majority';

    console.log('Attempting to connect to MongoDB...');
    try {
        await dbConnect();
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Database Name:', mongoose.connection.name);
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
