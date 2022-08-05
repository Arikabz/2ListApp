//document.querySelector("#addItem").addEventListener("click", moo())

const deleteBtn = document.querySelectorAll('.fa-trash')
const doneBtn = document.querySelectorAll('.fa-check')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(doneBtn).forEach((element)=>{
    //turn node list into array to use forEach
    element.addEventListener('click', markDone)
})

Array.from(deleteBtn).forEach((element)=>{
    //turn node list into array to use forEach
    element.addEventListener('click', deleteItem)
})

async function markDone() {
    const itemText = this.parentNode.childNodes[1].innerText.split(' ')
    const author = this.parentNode.childNodes[5].innerText
    const ID = document.querySelector('#listID').innerText
    const itemName = itemText[1]
    const itemNo = parseInt(itemText[0],10)
    console.log(itemText, author, ID, itemName, itemNo)
    try{
        const response = await fetch('/markDone', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listID: ID,
                itemNo: itemNo,
                itemName: itemName,
                author: author
            })
        })
        const data = await response.json()
        console.log(data)
        location.href = `http://localhost:2121/getList2/${ID}`
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText.split(' ')
    const author = this.parentNode.childNodes[5].innerText
    const ID = document.querySelector('#listID').innerText
    const itemName = itemText[1]
    const itemNo = parseInt(itemText[0],10)
    console.log(itemText, author, ID, itemName, itemNo)
    try{
        const response = await fetch('/deleteItem', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listID: ID,
                itemNo: itemNo,
                itemName: itemName,
                author: author
            })
        })
        const data = await response.json()
        console.log(data)
        location.href = `http://localhost:2121/getList2/${ID}`
        location.reload()
    }catch(err){
        console.log(err)
    }
}


function checkItems(){
    const listContent = document.querySelector(".list").childElementCount
    console.log(listContent)
    return listContent 
}

function checkInput(){
    const author = document.querySelector('#author').value;
    const itemName = document.querySelector('#itemName').value;
    return author && itemName 
}

function checkList(){
    const id = document.querySelector('#listID').innerText
    console.log(id)
    return id
}

function whatDo(){
    if(!checkInput()){
        console.log('no input');
        return
    }else if(!checkList()){
        console.log('no list')
        newListAndAdd1()
    }
    else if(!checkItems()){
        console.log('first item')
        addItem(0)
    }else{
        console.log('getting last')
        const num = document.querySelector('.list').lastElementChild.querySelector('.num-name').innerText
        console.log(parseInt(num,10))
        addItem(parseInt(num,10))
    }
}

async function newListAndAdd1(){
    const author = document.querySelector('#author').value;
    const itemName = document.querySelector('#itemName').value;
    try{
        const response = await fetch('/newListAdd1',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                author: author,
                itemName: itemName
            })
        })
        const data = await response.json()
        console.log(data)
        location.href = `http://localhost:2121/getList2/${data}`
    }catch(err){
        console.log(err)
    }
}

async function addItem(n){
    const lastitemNo = n;
    const ID = document.querySelector('#listID').innerText
    const author = document.querySelector('#author').value;
    const itemName = document.querySelector('#itemName').value;
    console.log(ID,lastitemNo,itemName, author)
    try{
        const response = await fetch(`/addItem/${ID}`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                lastitemNo: lastitemNo,
                listID: ID,
                itemName: itemName,
                author: author
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    } 
}

function moo (){
    const lastitemNo = document.querySelector(".list").lastElementChild.querySelector('.num-name').innerText.charAt(0)
    const ID = document.querySelector('#listID').innerText;
    const author = document.querySelector('#author').value;
    const itemName = document.querySelector('#itemName').value;
    console.log(lastitemNo,ID,author,itemName)
    }
