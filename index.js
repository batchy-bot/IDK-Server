console.clear()
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');


const app = express();
const PORT = 3001;

// const url = 'mongodb://localhost:27017';
const url = "mongodb+srv://batchy_bot:Tilapia-626@cluster0.kqimzoq.mongodb.net/?retryWrites=true&w=majority"
const dbName = 'idk-socmed';

/** Middlewares connection URL and database name */
app.use(express.json());

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
    res.send('Running')
})

/** GET /users route handler */
app.get('/users', async (req, res) => {
    try {
        // Connect to MongoDB Server
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        // Retrieve all users from idk-users collection
        const users = await db.collection('idk-users').find().toArray();

        // Close MongoDB client
        client.close();

        res.json(users)

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/** GET /users route handler */
app.get('/posts', async (req, res) => {
    try {
        // Connect to MongoDB Server
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        // Retrieve all posts from idk-users-posts collection
        const posts = await db.collection('idk-users-posts').find().toArray();
        console.log(posts)

        // Close MongoDB client
        client.close();

        console.log('Get Post Successful')
        res.json(posts)

    } catch (err) {
        console.log(err);
        console.log('Get Post Unsuccessful')

        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/add_post', async (req, res) => {
    const client = await MongoClient.connect(url);
    try {

        const db = client.db(dbName);
        const collection = db.collection('idk-users-posts'); // Replace with your collection name

        const newData = req.body; // Assuming the data is sent in the request body

        const result = await collection.insertOne(newData);
        console.log('Data added successfully:', result.insertedId);

        res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
        console.log('Error adding data:', error);
        res.status(500).json({ error: 'Error adding data' });
    } finally {
        await client.close();
    }
});

app.delete('/delete_post/:id', async (req, res) => {
    const client = await MongoClient.connect(url);

    try {
        const db = client.db(dbName);
        const collection = db.collection('idk-users-posts'); // Replace with your collection name

        const postId = req.params.id; // Assuming the post ID is passed as a route parameter

        const result = await collection.deleteOne({ _id: new ObjectId(postId) });
        console.log('Data deleted successfully:', result.deletedCount);

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        console.log('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    } finally {
        await client.close();
    }
});

app.post('/register_user', async (req, res) => {
    const client = await MongoClient.connect(url);
    try {
        const db = client.db(dbName);
        const collection = db.collection('idk-users');

        const newData = req.body;

        const result = await collection.insertOne(newData);
        console.log('Data added successfully: ', result.insertedId);

        res.status(200).json({ message: 'User Successfully Registered!' });
    } catch (error) {
        console.log('User Registration Error: ', error);
        res.status(500).json({ error: 'Error Adding Data' });
    } finally {
        await client.close()
    }
})


// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});