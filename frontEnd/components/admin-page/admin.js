document.getElementById('btn').addEventListener('click',()=>{
    buildPostBody();
    window.location.href = "/frontEnd/components/admin-manage/admin-manage.html";
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
        fetch('http://localhost:8125/api/products',{
            method:'POST',
            body:JSON.stringify(body)
        }).then(resp => resp.json()).then(data => {
            console.log(data);
        });
    });
    reader.readAsDataURL(file);
}