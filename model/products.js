const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');




module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        fs.readFile(p,(err,content)=>{
            const fileProducts = JSON.parse(content);
            fileProducts.push(this);
            fs.writeFile(p, JSON.stringify(fileProducts),(err)=>{
                console.log(err);
            });
        })
      
    }

    static fetchAllProduct(cb) {
        fs.readFile(p,(err,content)=>{
            const allProducts = JSON.parse(content);
            cb(allProducts);
        })
    }
}