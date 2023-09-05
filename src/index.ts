import {
    createUser,
    getAllUsers,
    createProduct,
    getAllProducts,
    searchProductsByName,
} from './database';

// => User:
createUser('u003', 'Astrodev', 'astrodev@email.com', 'astrodev99');

getAllUsers();

// => Product:
createProduct(
    'prod003',
    'SSD gamer',
    349.99,
    'Acelere seu sistema com velocidades incríveis de leitura e gravação.',
    'https://images.unsplash.com/photo'
);

getAllProducts();

// resultado (+) :
searchProductsByName('gamer');
// resultado (-) :
// searchProductsByName('aa');
