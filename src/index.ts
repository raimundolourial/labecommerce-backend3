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

// deleteUserById
app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const indexToDelete = users.findIndex((user) => user.id === id);
    if (indexToDelete >= 0) {
        users.splice(indexToDelete, 1);
    } else {
        console.log(`O id ${id} não existe`);
    }
    res.status(200).send({
        message: `User apagado com sucesso`,
    });
});

// deleteProductById
app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const indexToDelete = products.findIndex((product) => product.id === id);
    if (indexToDelete >= 0) {
        products.splice(indexToDelete, 1);
    } else {
        console.log(`O id ${id} não existe`);
    }
    res.status(200).send({
        message: `Produto apagado com sucesso`,
    });
});

// editProductById
app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const newId = req.body.id as string | undefined;
    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newDescription = req.body.description as string | undefined;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const product = products.find((product) => product.id === id);

    if (product) {
        product.id = newId || product.id;
        product.name = newName || product.name;
        product.price =
            newPrice !== undefined && !isNaN(Number(newPrice))
                ? newPrice
                : product.price;
        product.description = newDescription || product.description;
        product.imageUrl = newImageUrl || product.imageUrl;
    }

    res.status(200).send({ message: 'Atualização realizada com sucesso' });
});
