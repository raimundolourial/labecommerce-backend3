import {
    createUser,
    getAllUsers,
    createProduct,
    getAllProducts,
    searchProductsByName,
    products,
    users,
} from './database';

// => Exercício da aula de express e APIs:
import express, { Request, Response } from 'express';
import cors from 'cors';
import { TProducts, TUsers } from './types';

// => User:
// createUser('u003', 'Astrodev', 'astrodev@email.com', 'astrodev99');

// getAllUsers();

// => Product:
// createProduct(
//     'prod003',
//     'SSD gamer',
//     349.99,
//     'Acelere seu sistema com velocidades incríveis de leitura e gravação.',
//     'https://images.unsplash.com/photo'
// );

// getAllProducts();

// resultado (+) :
// searchProductsByName('gamer');
// resultado (-) :
// searchProductsByName('aa');

// => Exercício da aula de express e apis:
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003');
});

// Teste
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!');
});

// getAllUsers;
app.get('/users', (req: Request, res: Response) => {
    const result: TUsers[] = users;
    res.status(200).send(result);
});

// getAllProducts;
// app.get('/products', (req: Request, res: Response) => {
//     const result: TProducts[] = products;
//     res.status(200).send(result);
// });

// getAllProducts -> Refatorado
app.get('/products', (req: Request, res: Response) => {
    const query: string = req.query.q as string;
    if (query !== undefined) {
        const productsByName: TProducts[] = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        if (productsByName.length <= 0) {
            res.status(404).send('Nenhum produto encontrado');
        } else {
            res.status(200).send(productsByName);
        }
    } else {
        res.status(200).send(products);
    }
});

// createUser
app.post('/users', (req: Request, res: Response) => {
    const { id, name, email, password }: TUsers = req.body;
    const newUser: TUsers = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toLocaleString(),
    };
    users.push(newUser);
    res.status(201).send('Cadastro realizado com sucesso');
});

// createProduct
app.post('/products', (req: Request, res: Response) => {
    const { id, name, price, description, imageUrl }: TProducts = req.body;
    const newProduct: TProducts = {
        id,
        name,
        price,
        description,
        imageUrl,
    };
    products.push(newProduct);
    res.status(201).send('Produto cadastrado com sucesso');
});
