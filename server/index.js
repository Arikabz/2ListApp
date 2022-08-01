const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
require('dotenv').config()
const connectionString = process.env.connectionString
const PORT = 2121

let db,
    dbName = 'listAppdb',
    listCollection

MongoClient.connect(connectionString, { useUnifiedTopology: false })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        listCollection = db.collection('listID-items')
    })

app.set('view engine', 'ejs')
app.use(express('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())


function List (){
            this.listID = makeid()
            this.items = []
        }
function makeid() {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var charactersLength = 6;
            for ( var i = 0; i < charactersLength; i++  ) {
                      result += characters.charAt(Math.floor(Math.random() * 
                       charactersLength));
            }
               return result;
        }
function Item (itemNo, itemName, author){
            this.itemNo = itemNo
            this.itemName = itemName
            this.author = author
        }

app.get('/', (req,res) => {
    res.render('index.ejs', {items: [], listID: ''})
})

app.post('/getList', (req,res) => {
    const id = req.body.listID
    if(id){
    const listItems = listCollection.find({"listID": id}).toArray()
            .then(result=> {
                if(result[0]){
                    console.log(result[0].items)
                    res.render('index.ejs', {items: result[0].items,
                        listID: result[0].listID})
                } 
                else{
                    res.render('index.ejs', {items: [], listID: 'List not found.'})
                    console.log('List ID not found')
                }
       })
    }
    else{
        console.log('No input')
    }
})

app.get('api/:id', (req,res) => {
    const id = req.params.id
    listCollection.find(list => list.listID == id)
        .then(results => {
            console.log(results)
            res.json(results)
        })
})

app.get('/test', (res,req) => {
    console.log('test successful')
})

app.post('/newList', (req,res) => {
    const newList = new List()
    console.log(newList)
    listCollection.insertOne(newList)
        .then(result => {
            res.redirect('/')
            console.log(result)
        })
})

app.put('/addItem/:id', (req,res) => {
    const id = request.params.id
    const newItem = new Item(newNumber(), req.body.itemName, req.body.author)
    var arrlist = listCollection.find(list => list.listID == id).items
    arrlist.push(newItem)
    listCollection.findOneAndUpdate({listID: id},
        {
            $set: {
                items: arrlist
            }
        }, {
            upsert: false
        })
        .catch(error => console.log(error))
})

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})
