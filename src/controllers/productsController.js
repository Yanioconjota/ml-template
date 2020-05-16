const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const finalPrice = (price, discount) => {
  if (discount > 0) {
    price = price - (price * discount / 100);
  } else {
    price = price;
  }
  return toThousand(price);
}

const controller = {
  // Root - Show all products
  root: (req, res) => {
    res.render('products', {
      products: products,
      finalPrice: finalPrice
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    id = req.params.productId;
    const product = products.find(p => p.id == id);
    res.render('detail', {
      product: product,
      toThousand: toThousand,
      finalPrice: finalPrice
    });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render('product-create-form');
  },

  // Create -  Method to store
  store: (req, res) => {
    //Crear objeto con todas las propiedades del form
    const newId = products.length + 1;
    const newProduct = {
      id: newId,
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      description: req.body.description,
      image: 'default-image.png'
    };
    // Lo agregamos al objeto original
    const finalProduct = [...products, newProduct]; //Esto crea un nuevo array con todos los onjetos del array y agrega una nueva posicion con el objeto que creamos
    // Sobrescrivimos el JSON
    fs.writeFileSync(productsFilePath, JSON.stringify(finalProduct, null, ' '));
    // redirigimos a la home
    res.redirect('/');
  },

  // Update - Form to edit
  edit: (req, res) => {
    //obtener id del producto
    id = req.params.productId;
    const productToEdit = products.find(p => p.id == id);
    //renderizar el formulario de edición con los datos obtenidos
    res.render('product-edit-form', {
      productToEdit: productToEdit
    });

  },
  // Update - Method to update
  update: (req, res) => {
    // editar producto con id obtenido
    id = req.params.productId;
    const currentProduct = products.find(p => p.id == id);
    currentProduct.name = req.body.name;
    currentProduct.price = req.body.price;
    currentProduct.discount = req.body.discount;
    currentProduct.category = req.body.category;
    currentProduct.description = req.body.description;
    // res.send(products);
    // reescribir json
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));

    // volver al detalle
    res.redirect('/');
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    id = req.params.productId;
    let newProducts = products.filter(p => p.id != id);
    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, ' '));
    res.redirect('/');
  }
};

module.exports = controller;