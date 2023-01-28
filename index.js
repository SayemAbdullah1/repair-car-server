const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1q1hbsc.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const servicesCollection = client.db('repairCar').collection('services')
        const orderCollection = client.db('repairCar').collection('orders')

        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services);
        })
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        // orders
        app.get('/orders', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query)
            const order = await cursor.toArray()
            res.send(order)
        })
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

        app.path('/orders/:id', async(req, res)=>{
            const id = req.param.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) =>{
    res.send('repair car server is running')
})

app.listen(port, () =>{
    console.log(`repair car server is running on ${port}`);
})