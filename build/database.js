"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductsByName = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.products = exports.users = void 0;
exports.users = [
    {
        id: 'u001',
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'fulano123',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'u002',
        name: 'Beltrana',
        email: 'beltrana@email.com',
        password: 'beltrana00',
        createdAt: new Date().toLocaleString(),
    },
];
exports.products = [
    {
        id: 'prod001',
        name: 'Mouse gamer',
        price: 250,
        description: 'Melhor mouse do mercado!',
        imageUrl: 'https://picsum.photos/seed/Mouse%20gamer/400',
    },
    {
        id: 'prod002',
        name: 'Monitor',
        price: 900,
        description: 'Monitor LED Full HD 24 polegadas',
        imageUrl: 'https://picsum.photos/seed/Monitor/400',
    },
];
const createUser = (id, name, email, password) => {
    const newRegister = {
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toLocaleString(),
    };
    exports.users.push(newRegister);
    console.log('📌 createUser: ', 'Cadastro realizado com sucesso');
};
exports.createUser = createUser;
const getAllUsers = () => {
    console.log('📌 getAllUsers:', exports.users);
};
exports.getAllUsers = getAllUsers;
const createProduct = (id, name, price, description, imageUrl) => {
    const newRegister = {
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl,
    };
    exports.products.push(newRegister);
    console.log('📌 createProduct', 'Produto criado com sucesso');
};
exports.createProduct = createProduct;
const getAllProducts = () => {
    console.log('📌 getAllProducts:', exports.products);
};
exports.getAllProducts = getAllProducts;
const searchProductsByName = (name) => {
    let productFound = false;
    exports.products.forEach((product) => {
        if (product.name.toLowerCase().includes(name.toLowerCase())) {
            console.log('📌 searchProductsByName:', product);
            productFound = true;
        }
    });
    if (!productFound) {
        console.log('📌 searchProductsByName:', 'Produto NÃO encontrado');
    }
};
exports.searchProductsByName = searchProductsByName;
//# sourceMappingURL=database.js.map