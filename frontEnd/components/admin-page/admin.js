document.getElementById('btn').addEventListener('click',()=>{
    // console.log(document.getElementById('img').files);
    // let file = document.getElementById('img').files[0];
    // let reader = new FileReader();
    // reader.addEventListener('load',function(){
    //     console.log(reader.result);
    // });
    // reader.readAsDataURL(file);
    buildPostBody();
});

function buildPostBody(){
    let body = {};
    body.name = document.getElementById('name').value;
    body.description = document.getElementById('descriere').value.trim();
    body.price = parseFloat(document.getElementById('price').value);
    body.quantity = parseInt(document.getElementById('quantity').value);
    body.category = document.getElementById('category').value;
    body.visits = 0;
    let file = document.getElementById('img').files[0];
    let reader = new FileReader();
    reader.addEventListener('load',function(){
        body.image = reader.result;
        fetch(' ',{
            method:'POST',
            body:JSON.stringify(body)
        }).then(resp => resp.json()).then(data => {
            console.log(data);
        });
    });
    reader.readAsDataURL(file);
} 