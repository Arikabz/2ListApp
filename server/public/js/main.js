//document.querySelector("#addItem").addEventListener("click", moo())

async function addItem(){
    const lastitemNo = document.querySelector(".list").lastElementChild.querySelector('.num-name').innerText.charAt(0)
    const ID = document.querySelector('#listID').innerText;
    const author = document.querySelector('#author').value;
    const itemName = document.querySelector('#itemName').value;
    console.log(ID,lastitemNo,itemName, author)
    try{
        const response = await fetch(`addItem/${ID}`,{
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
