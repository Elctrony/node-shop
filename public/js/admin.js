function deleteProduct (btn){

    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    
    const productElement  = btn.closest('article');

    fetch('/admin/product/' + productId,{
        method: 'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        console.log(result);
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err=>{
        console.log(err);
    })
    console.log("MILE DATA");
    console.log(btn);
    console.log(productId);
    console.log(csrf);
}