import { products, users } from './database';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { TProducts, TUsers } from './types';
import {
    CheckElementExists,
    CheckEmail,
    CheckPassword,
    CheckPrefixId,
    checkMinimumLength,
    isNotEmpty,
    isNumber,
    isString,
    isUniqueEmail,
    isUniqueId,
} from './validations';

// Configs Express:
const app = express();

app.use(express.json());
app.use(cors());
app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003');
});

// Funções:
// ✔ getAllUsers:
app.get('/users', (req: Request, res: Response): void => {
    try {
        const result: TUsers[] = users;
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ getAllProducts
app.get('/products', (req: Request, res: Response): void => {
    try {
        const query: string = req.query.q as string;

        if (query !== undefined) {
            checkMinimumLength(query, 'Query Params', 1, res);
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
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ createUser
app.post('/users', (req: Request, res: Response): void => {
    try {
        const { id, name, email, password }: TUsers = req.body;

        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        isUniqueId(id, 'Id', users, res);
        CheckPrefixId(id, 'Id', 'u', res);
        checkMinimumLength(id, 'Id', 4, res);

        // => NAME
        isString(name, 'Name', res);
        isNotEmpty(name, 'Name', res);
        checkMinimumLength(name, 'Name', 2, res);

        // => EMAIL
        isString(email, 'Email', res);
        isNotEmpty(email, 'Email', res);
        isUniqueEmail(email, 'Email', users, res);
        CheckEmail(email, 'Email', res);

        // => PASSWORD
        isString(password, 'Senha', res);
        isNotEmpty(password, 'Senha', res);
        // Por enquanto usando apenas pra senha ter ao menos 6 dígitos
        CheckPassword(password, 'Senha', res);

        const newUser: TUsers = {
            id,
            name,
            email,
            password,
            createdAt: new Date().toLocaleString(),
        };
        users.push(newUser);
        res.status(201).send('Cadastro realizado com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ createProduct
app.post('/products', (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl }: TProducts = req.body;
        const newProduct: TProducts = {
            id,
            name,
            price,
            description,
            imageUrl,
        };

        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        isUniqueId(id, 'Id', products, res);
        CheckPrefixId(id, 'Id', 'prod', res);
        checkMinimumLength(id, 'Id', 7, res);

        // => NAME
        isString(name, 'Name', res);
        isNotEmpty(name, 'Name', res);
        checkMinimumLength(name, 'Name', 2, res);

        // => PRICE
        isNumber(price, 'Preço', res);

        // => DESCRIPTION
        isString(description, 'Descrição', res);
        isNotEmpty(description, 'Descrição', res);
        checkMinimumLength(description, 'Descrição', 2, res);

        // => IMAGEMURL
        isString(imageUrl, 'URL da imagem', res);
        isNotEmpty(imageUrl, 'URL da imagem', res);
        checkMinimumLength(imageUrl, 'URL da imagem', 2, res);

        products.push(newProduct);
        res.status(201).send('Produto cadastrado com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ deleteUserById
app.delete('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        CheckElementExists(id, 'Id', users, res);
        const indexToDelete = users.findIndex((user) => user.id === id);
        if (indexToDelete >= 0) {
            users.splice(indexToDelete, 1);
        } else {
            console.log(`O id ${id} não existe`);
        }
        res.status(200).send('Usuário apagado com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ deleteProductById
app.delete('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        CheckElementExists(id, 'Id', products, res);
        const indexToDelete = products.findIndex(
            (product) => product.id === id
        );
        if (indexToDelete >= 0) {
            products.splice(indexToDelete, 1);
        } else {
            console.log(`O id ${id} não existe`);
        }
        res.status(200).send('Produto apagado com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ editProductById
app.put('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newId = req.body.id as string | undefined;
        const newName = req.body.name as string | undefined;
        const newPrice = req.body.price as number | undefined;
        const newDescription = req.body.description as string | undefined;
        const newImageUrl = req.body.imageUrl as string | undefined;
        CheckElementExists(id, 'Id', products, res);

        const product = products.find((product) => product.id === id);

        if (product) {
            if (newId !== undefined) {
                isString(newId, 'Novo Id', res);
                isNotEmpty(newId, 'Novo Id', res);
                isUniqueId(newId, 'Novo Id', products, res);
                CheckPrefixId(newId, 'Novo Id', 'prod', res);
                checkMinimumLength(newId, 'Novo Id', 7, res);
                product.id = newId;
            } else {
                product.id = product.id;
            }

            if (newName !== undefined) {
                isString(newName, 'Novo Name', res);
                isNotEmpty(newName, 'Novo Name', res);
                checkMinimumLength(newName, 'Novo Name', 2, res);
                product.name = newName;
            } else {
                product.name = product.name;
            }

            if (newPrice !== undefined) {
                isNumber(newPrice, 'Novo Preço', res);
                isNotEmpty(newPrice, 'Novo Preço', res);
                product.price = newPrice;
            } else {
                product.price = product.price;
            }

            if (newDescription !== undefined) {
                isString(newDescription, 'Nova Descrição', res);
                isNotEmpty(newDescription, 'Nova Descrição', res);
                checkMinimumLength(newDescription, 'Nova Descrição', 2, res);
                product.description = newDescription;
            } else {
                product.description = product.description;
            }

            if (newImageUrl !== undefined) {
                isString(newImageUrl, 'Nova URL da imagem', res);
                isNotEmpty(newImageUrl, 'Nova URL da imagem', res);
                checkMinimumLength(newImageUrl, 'Nova URL da imagem', 2, res);
                product.imageUrl = newImageUrl;
            } else {
                product.imageUrl = product.imageUrl;
            }
        }

        res.status(200).send('Atualização realizada com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
