const express = require('express')
const mongoClient = require('mongodb').MongoClient

const url = "mongodb+srv://dbuser:qwe123@cluster0.ueb1t.mongodb.net/hotel?retryWrites=true&w=majority" //"mongodb://localhost:27017"

const app = express()
app.use(express.json())

mongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    
    if (err) {
        console.log("Could not connect to mongodb")
    } else {

        const myDb = db.db('hotel')  //database name
        const collection = myDb.collection('user') // collection name

        app.post('/login', (req, res) => {

            const query = {
                username: req.body.username,
                password: req.body.password
            }

            collection.findOne(query, (err, result) => {

                if (result != null) {

                    const onjToSend = {
                        username: result.username, 
                    }

                    res.status(200).send(JSON.stringify(onjToSend))

                } else {
                    res.status(404).send()
                }

            })
        })
    }
})

PORT = 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})