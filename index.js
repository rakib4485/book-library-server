const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efsdsdy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const booksCollection = client.db('booksLibrary').collection('books');
        const categoriesCollection = client.db('booksLibrary').collection('categories');
        const bookingsCollection = client.db('booksLibrary').collection('bookings');
        const usersCollection = client.db('booksLibrary').collection('users');

        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        });

        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const category = await cursor.toArray();
            res.send(category);
        });

        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id }
            const selectedBooks = await booksCollection.find(query).toArray();
            res.send(selectedBooks);
        });


        app.get('/bookDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const selectedBooks = await booksCollection.findOne(query);
            res.send(selectedBooks);
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id }
            const category = await categoriesCollection.findOne(query);
            res.send(category);
        })

        app.post('/books', async(req, res) => {
            const book = req.body;
            const query = {};
            const result = await booksCollection.insertOne(book);
            res.send(result);
        });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const query = {};
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get("/bookings/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
          });

        app.get("/bookings", async (req, res) => {
            const query = {};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
          });

        // app.put('/categories/:id/products', async (req, res) => {
        //     const id = req.params.id;
        //     const book = req.body;
        //     const filter = {category_id: id };
        //     const product = await booksCollection.findOne(filter);
        //     const books = product.products;
        //     const newBooks = [...books, book];
        //     const option = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             total:newBooks.length,
        //             products: newBooks,
        //         },
        //     };
        //     const result = await booksCollection.updateOne(
        //         filter,
        //         updatedDoc,
        //         option
        //     );
        //     res.send(result);
        // });

        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = {
              email: user.email,
            };
            const alreadyAssigned = await usersCollection.find(query).toArray();
            if (alreadyAssigned.length) {
              return res.send({ acknowledged: false });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
          });

          app.get("/users", async (req, res)=> {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
          })

          app.get("/user/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "admin" });
          });

          app.put("/users/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
              $set: {
                role: "admin",
              },
            };
            const result = await usersCollection.updateOne(
              filter,
              updatedDoc,
              option
            );
            res.send(result);
          });

    }
    finally {

    }
}

run().catch(() => console.log(error))

app.get('/', (req, res) => {
    res.send('Book Library is Running')
});

app.listen(port, () => {
    console.log(`book api is running on port ${port}`)
})