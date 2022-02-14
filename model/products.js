const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        fs.readFile(p, (err, content) => {
            const products = JSON.parse(content);
            products.push(this);
            console.log(products);
            fs.writeFile(p,JSON.stringify(products),(err)=>{})
        });
    }

    static fetchAllProducts(cb){
        fs.readFile(p,(err,content)=>{
            const allProduct = JSON.parse(content);
            cb(allProduct);
        })
    }
}