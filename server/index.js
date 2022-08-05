const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
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
app.use('*/js',express.static('public/js'));
app.use('*/css',express.static('public/css'));
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
            this.done = false;
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
app.get('/getList2/:id', (req,res) => {
    const id = req.params.id
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
            res.redirect(`/getList2/${newList.listID}`)
            console.log(result)
        })
})

app.post('/newListAdd1', (req,res) => {
    const itemName = req.body.itemName;
    const author = req.body.author;
    const newItem = new Item(1, itemName, author)
    const newList = new List()
    newList.items.push(newItem)
    console.log(newList)
    listCollection.insertOne(newList)
        .then(result => {
            //res.render('index.ejs', {items: newItem, listID: newList.listID})
            //res.redirect(`/getList2/${newList.listID}`)
            res.json(newList.listID)
            console.log(result)
        })
})

function newNumber(n){
    n = parseInt(n,10)
    return n+1
}


app.post('/addItem/:id', (req,res) => {
    const id = req.params.id
    console.log(id)
    const newItem = new Item(newNumber(req.body.lastitemNo), req.body.itemName, req.body.author)
    const findList = listCollection.find({"listID": id}).toArray()
        .then(result => {
            let updatedList = result[0].items
            updatedList.push(newItem)
            console.log(updatedList)
            listCollection.findOneAndUpdate({listID: id},
        {
            $set: {
                items: updatedList
            }
        }, {
            upsert: false
        }).then(
            res.json('Item added.')
        )
        .catch(error => console.log(error))
        }).catch(error => console.log(error))
})

app.put('/markDone', (req,res) =>{
    listCollection.find({listID: req.body.listID}).toArray()
        .then(result =>{
            let itemsUpdated = result[0].items
            console.log(itemsUpdated)
            let indexUpdate = itemsUpdated.findIndex(x=> (x.itemNo==req.body.itemNo)&&
            (x.itemName==req.body.itemName)&&(x.author==req.body.author))
            console.log('indexUpdate = ' + indexUpdate)
            let done = itemsUpdated[indexUpdate].done
            if(done){ done = false } else{ done = true }
            itemsUpdated[indexUpdate].done = done
    listCollection.findOneAndUpdate({listID: req.body.listID},{
        $set: {
            items: itemsUpdated
        }
    },{
        upsert: false
    })
                .then(result=> {
                    console.log(result)
                    res.json('Item marked done.')
                })
        .catch(error=> console.log(error))

        })
        .catch(error=> console.log(error))

})

app.put('/deleteItem', (req,res) => {
    listCollection.find({listID: req.body.listID}).toArray()
        .then(result =>{
            let itemsUpdated = result[0].items
            console.log(itemsUpdated)
            let indexDel = itemsUpdated.findIndex(x=> (x.itemNo==req.body.itemNo)&&
            (x.itemName==req.body.itemName)&&(x.author==req.body.author))
            console.log('indexDel = ' + indexDel)
            itemsUpdated.splice(indexDel,1)
            itemsUpdated.forEach((x,i)=>{
                x.itemNo = i+1
            })
    listCollection.findOneAndUpdate({listID: req.body.listID},{
        $set: {
            items: itemsUpdated
        }
    },{
        upsert: false
    })
                .then(result=> {
                    console.log(result)
                    res.json('Item deleted.')
                })
        .catch(error=> console.log(error))

        })
        .catch(error=> console.log(error))

})

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})
