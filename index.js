const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello from db, it's working");
})

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;
const productTbl = process.env.DB_PRODUCT_TBL;
const orderTbl = process.env.DB_ORDER_TBL;
const uri = `mongodb+srv://${user}:${password}@cluster0.w7kbq.mongodb.net/${dbname}?retryWrites=true&w=majority`;
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfmry.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(dbname).collection(productTbl);
  const orderCollection = client.db(dbname).collection(orderTbl);

 
    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, items) => {
            res.send(items);
            console.log('from database',items)
        })
    })

    app.get('/orders', (req, res) => {
      orderCollection.find({email: req.query.email})
      .toArray((err, items) => {
          res.send(items);
      })
  })

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log('adding new product: ', newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  

  app.post('/addOrder', (req, res) => {
    const orderInformation = req.body;
    console.log('adding new product: ', orderInformation);
    orderCollection.insertOne(orderInformation)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.delete('/deleteProduct/:id', (req, res) => {
    productCollection.findOneAndDelete({_id: ObjectID (req.params.id)})
    .then( (result) => {
        res.send(result.deletedCount > 0);
    })
})

});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

