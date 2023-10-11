import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
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

// -- TESTE:
app.get('/ping', async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong de Teste!' });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// Funções:
// ✔ getAllUsers:
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM users`);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ✔ getAllProducts
app.get('/products', async (req: Request, res: Response) => {
    try {
        const query: string = req.query.q as string;
        let result;
        if (!query) {
            result = await db.raw('SELECT * FROM products');
        } else {
            result = await db.raw('SELECT * FROM products WHERE name LIKE ?', [
                `%${query}%`,
            ]);
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ✔ createUser
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password }: TUsers = req.body;

        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db.raw(
            `SELECT id FROM users WHERE id ="${id}"`
        );
        if (verifyId) {
            throw new Error('O id precisa ser único');
        }
        CheckPrefixId(id, 'Id', 'u', res);
        checkMinimumLength(id, 'Id', 4, res);

        // => NAME
        isString(name, 'Name', res);
        isNotEmpty(name, 'Name', res);
        checkMinimumLength(name, 'Name', 2, res);

        // => EMAIL
        isString(email, 'Email', res);
        isNotEmpty(email, 'Email', res);
        const [verifyEmail] = await db.raw(
            `SELECT id FROM users WHERE id ="${id}"`
        );
        if (verifyEmail) {
            throw new Error('O email precisa ser único');
        }
        CheckEmail(email, 'Email', res);

        // => PASSWORD
        isString(password, 'Senha', res);
        isNotEmpty(password, 'Senha', res);

        // Por enquanto usando apenas pra senha ter ao menos 6 dígitos
        CheckPassword(password, 'Senha', res);
        await db.raw(`INSERT INTO
        users (id, name, email, password)
        VALUES (
            '${id}',
            '${name}',
            '${email}',
            '${password}'
        )`);
        res.status(201).send('Cadastro realizado com sucesso');
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ✔ createProduct
app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl }: TProducts = req.body;

        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db.raw(
            `SELECT id FROM products WHERE id ="${id}"`
        );
        if (verifyId) {
            throw new Error('O id precisa ser único');
        }
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

        await db.raw(`INSERT INTO
        products (id, name, price, description, image_url)
        VALUES (
            '${id}',
            '${name}',
            '${price}',
            '${description}',
            '${imageUrl}'
        )`);

        res.status(201).send(`Produto ${name} cadastrado com sucesso`);
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ✔ createPurchase
app.post('/purchase', async (req: Request, res: Response) => {
    try {
        const { id, buyer, total_price } = req.body;

        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db.raw(
            `SELECT id FROM users WHERE id ="${id}"`
        );
        if (verifyId) {
            throw new Error('O id precisa ser único');
        }
        CheckPrefixId(id, 'Id', 'pur', res);
        checkMinimumLength(id, 'Id', 4, res);

        // => BUYER
        isString(buyer, 'Buyer', res);
        isNotEmpty(buyer, 'Buyer', res);
        const [verifyBuyer] = await db.raw(
            `SELECT id FROM users WHERE id ="${buyer}"`
        );
        if (!verifyBuyer) {
            throw new Error('O id do comprador (buyer) não existe');
        }
        CheckPrefixId(buyer, 'Buyer', 'u', res);
        checkMinimumLength(buyer, 'Buyer', 4, res);

        // => TOTAL_PRICE
        isNumber(total_price, 'Total Price', res);
        isNotEmpty(total_price, 'Total Price', res);

        await db.raw(`INSERT INTO
        purchases (id, buyer, total_price)
        VALUES (
            '${id}',
            '${buyer}',
            '${total_price}'
        )`);
        res.status(201).send('Compra cadastrada com sucesso');
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ✔ editProductById
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newId = req.body.id as string | undefined;
        const newName = req.body.name as string | undefined;
        const newPrice = req.body.price as number | undefined;
        const newDescription = req.body.description as string | undefined;
        const newImageUrl = req.body.imageUrl as string | undefined;
        console.log(newId, newName, newPrice, newDescription, newImageUrl);
        const [product] = await db.raw(
            `SELECT * FROM products WHERE id = "${id}"`
        );
        // Verificando se o id da url existe:
        const [verifyId] = await db.raw(
            `SELECT id FROM products WHERE id ="${id}"`
        );
        if (!verifyId) {
            throw new Error(
                'O produto não existe, pois id passado na url não está presente em products'
            );
        }
        // Verificando se o newId é único:
        const [verifyNewId] = await db.raw(
            `SELECT id FROM products WHERE id ="${newId}"`
        );
        if (verifyNewId) {
            throw new Error('newId precisa ser único!');
        }
        if (product) {
            if (newId !== undefined) {
                isString(newId, 'Novo Id', res);
                isNotEmpty(newId, 'Novo Id', res);
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
        await db.raw(`
        UPDATE products SET
        id = '${newId || product.id}', name = '${
            newName || product.name
        }', price = '${newPrice || product.price}', description = '${
            newDescription || product.description
        }', image_url = '${newImageUrl || product.image_url}'
        WHERE id = '${id}'
    `);
        res.status(200).send('Atualização realizada com sucesso');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ Delete Purchase By Id
app.delete('/purchase/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const [verifyId] = await db.raw(
            `SELECT id FROM purchases WHERE id ="${id}"`
        );
        if (!verifyId) {
            throw new Error('Não existe compra com esse id');
        }
        await db.raw(`DELETE FROM purchases WHERE id ="${id}"`);
        res.status(200).send({
            message: 'Pedido cancelado com sucesso',
        });
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// EXTRA - PURCHASES
// ✔ Get All Purchases:
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM purchases`);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// EXTRA - DELETES PRODUCTS E USERS
// ✔ deleteUserById
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const [verifyId] = await db.raw(
            `SELECT id FROM users WHERE id ="${id}"`
        );
        if (!verifyId) {
            throw new Error('Não existe usuário com o id fornecido');
        }
        await db.raw(`DELETE FROM users WHERE id ="${id}"`);
        res.status(200).send({
            message: 'Usuário excluído com sucesso',
        });
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});

// ✔ deleteProductById
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const [verifyId] = await db.raw(
            `SELECT id FROM products WHERE id ="${id}"`
        );
        if (!verifyId) {
            throw new Error('Não existe produto com o id fornecido');
        }
        await db.raw(`DELETE FROM products WHERE id ="${id}"`);
        res.status(200).send({
            message: 'Produto excluído com sucesso',
        });
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
