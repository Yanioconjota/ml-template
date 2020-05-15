const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = numero => numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const finalPrice = (price, discount) => {
  if (discount > 0) {
    price = price - (price * discount / 100);
  } else {
    price = price;
  }
  return toThousand(price);
}

const pdtosInSale = products.filter(pdto => pdto.category == 'in-sale');
const pdtosVisited = products.filter(pdto => pdto.category == 'visited');

const controller = {
  root: (req, res) => {
    res.render('index', {
      productsInSale: pdtosInSale,
      productosVisited: pdtosVisited,
      toThousand: toThousand,
      finalPrice: finalPrice
    });
  },
  search: (req, res) => {
    let keyword = req.query.keywords;
    let results = products.filter(p => p.name.includes(keyword));
    // console.log(results);

    res.render('results', {
      results: results,
      toThousand: toThousand,
      finalPrice: finalPrice
    });

  },
  all: (req, res) => {
    res.render('products', {
      products: products,
      finalPrice: finalPrice
    });
  }
};

module.exports = controller;
