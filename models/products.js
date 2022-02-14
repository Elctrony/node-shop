const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
      }

    save() {
        fetchAllProducts(products=>{
            products.push(this);
            console.log(products);
            fs.writeFile(p,JSON.stringify(products),(err)=>{})
        })
      
    }

    static fetchAllProducts(cb){
        fs.readFile(p,(err,content)=>{
            const allProduct = JSON.parse(content);
            cb(allProduct);
        })
    }
}