const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssi7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();

        const database = client.db('online_shop');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users');
        const bookingsCollection = database.collection('bookings');
        const reviewsCollection = database.collection('reviews')

        // get all services api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        // get manage services api
        app.get('/manageServices', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        // get single service api
        app.get('/singleService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        // get admin users api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // get MyOrder api
        app.get('/myOrders/:email', async (req, res) => {
            const result = await bookingsCollection.find({ email: req.params.email }).toArray();
            res.send(result);

        })

        // manageAll order get api
        app.get('/allOrders', async (req, res) => {
            const result = await bookingsCollection.find({}).toArray();
            res.send(result);

        })

        // update status api
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            const result = await bookingsCollection.updateOne(filter, {
                $set: { status: updateStatus }
            })
            res.send(result);
        })

        // user post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        // product add post api
        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const result = await servicesCollection.insertOne(product);
            res.json(result);
        })

        // post confirm api
        app.post('/confirmOrder', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result)
        })

        // user role update api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user?.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // delete order api
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        })

        // services collection delete api
        app.delete('/deleteService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })

        // review post api
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })

        // client review get api
        app.get('/clientReview', async (req, res) => {
            const clientReview = reviewsCollection.find({})
            const result = await clientReview.toArray();
            res.json(result);

        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World car server')
})

app.listen(port, () => {
    console.log('Example app list', port)
})