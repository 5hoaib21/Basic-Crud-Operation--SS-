const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 8008;
app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    product: "Wireless Mouse",
    price: 25,
  },
  {
    id: 2,
    product: "Mechanical Keyboard",
    price: 80,
  },
  {
    id: 3,
    product: "Gaming Headset",
    price: 60,
  },
  {
    id: 4,
    product: "27 Inch Monitor",
    price: 220,
  },
  {
    id: 5,
    product: "USB-C Hub",
    price: 35,
  },
];

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("e-commerce");
    const productsCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/products/:productId", async (req, res) => {
      const productId = req.params.productId;

      const query = { _id: new ObjectId(productId) };

      const result = await productsCollection.findOne(query);

      res.send(result);
    });

    app.post("/products", async (req, res) => {
      // console.log(req.body, "request");
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
      // console.log(result, 'result ');
    });

    app.delete("/products/:productId", async (req, res) => {
      const productId = req.params.productId;
      const query = { _id: new ObjectId(productId) };
      const result = await productsCollection.deleteOne(query)
      console.log(result, "result ID");
      res.send(result)
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!......");
});

app.listen(port, () => {
  console.log(`Server app listening from ${port}`);
});
