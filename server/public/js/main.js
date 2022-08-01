async function addItem(){
    const ID = document.querySelector('#listID').textContent();
    const author = document.querySelector('#author').textContent();
    const itemName = document.querySelector('#itemName').textContent();
    try{
        const response = await fetch(`/addItem/${ID}`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: {
                listID: ID,
                itemName: itemName,
                author: author
            }
        })
    }catch(err){
        console.log(err)
    } 
}
