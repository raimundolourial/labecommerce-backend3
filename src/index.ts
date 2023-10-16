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

//  TESTE

//  ✔  Ping-Pong
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

// GET

// 📌 Get all users
// ✅ Detalhes revisados!
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db
            .select(
                'id',
                'name',
                'email',
                'password',
                'created_at AS createdAt'
            )
            .from('users')
            .orderBy('id', 'ASC');
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

// 📌 Get all products (funcionalidade 1 e 2):
// ✅ Detalhes revisados!
app.get('/products', async (req: Request, res: Response) => {
    try {
        const query: string = req.query.name as string;
        let result;
        if (!query) {
            result = await db
                .select(
                    'id',
                    'name',
                    'price',
                    'description',
                    'image_url AS imageUrl'
                )
                .from('products')
                .orderBy('id', 'ASC');
        } else {
            result = await db
                .select(
                    'id',
                    'name',
                    'price',
                    'description',
                    'image_url AS imageUrl'
                )
                .from('products')
                .orderBy('id', 'ASC')
                .whereLike('name', `%${query}%`);
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

// EXTRA - PURCHASES
// ✔ Detalhes revisados!
// ✔ Get all purchases:
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db('purchases').orderBy('id', 'ASC');
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

// 📌 Get Purchase by id
// ✅ Detalhes revisados!
app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id as string;

        const [isIdValid] = await db
            .select('*')
            .from('purchases')
            .where({ id: id });

        if (!isIdValid) {
            throw new Error(
                'O id fornecido não corresponde a nenhuma compra registrada'
            );
        }

        const userDataBuyer = await db
            .select(
                'purchases.id AS purchaseId',
                'purchases.buyer AS buyerId',
                'users.name AS buyerName',
                'users.email AS buyerEmail',
                'total_price AS totalPrice',
                'purchases.created_at AS createdAt'
            )
            .from('purchases')
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .where({ 'purchases.id': id });

        const products = await db('purchases_products')
            .select(
                'product_id AS id',
                'name',
                'price',
                'description',
                'image_url AS imageUrl',
                'quantity'
            )
            .innerJoin(
                'products',
                'products.id',
                '=',
                'purchases_products.product_id'
            )
            .where({ 'purchases_products.purchase_id': id });

        const result = {
            ...userDataBuyer[0],
            products,
        };

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

// POST

// 📌 Create user
// ✅ Detalhes revisados!
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password }: TUsers = req.body;

        // => VALIDAÇÕES:
        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db
            .select('id')
            .from('users')
            .where({ id: id });
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
        const [verifyEmail] = await db
            .select('email')
            .from('users')
            .where({ email: email });
        if (verifyEmail) {
            throw new Error('O email precisa ser único');
        }
        CheckEmail(email, 'Email', res);

        // => PASSWORD
        isString(password, 'Senha', res);
        isNotEmpty(password, 'Senha', res);

        // Por enquanto usando apenas pra senha ter ao menos 6 dígitos
        CheckPassword(password, 'Senha', res);

        const newUser = {
            id,
            name,
            email,
            password,
        };
        await db('users').insert(newUser);
        res.status(201).send({
            message: 'Cadastro realizado com sucesso',
        });
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

// 📌 Create product
// ✅ Detalhes revisados!
app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl }: TProducts = req.body;

        // => VALIDAÇÕES:
        // => ID
        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db
            .select('id')
            .from('products')
            .where({ id: id });
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
        isString(imageUrl, 'imageUrl', res);
        isNotEmpty(imageUrl, 'imageUrl', res);
        checkMinimumLength(imageUrl, 'imageUrl', 2, res);

        const newProduct = {
            id,
            name,
            price,
            description,
            image_url: imageUrl,
        };
        await db('products').insert(newProduct);

        res.status(201).send({
            message: 'Produto cadastrado com sucesso',
        });
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

// 📌 Create purchase
// ✅ Detalhes revisados!
app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { idPurchase, idBuyer, idProduct, quantity } = req.body;

        // ==> VALIDAÇÕES
        // => idPurchase
        isString(idPurchase, 'idPurchase', res);
        isNotEmpty(idPurchase, 'idPurchase', res);
        CheckPrefixId(idPurchase, 'idPurchase', 'pur', res);
        checkMinimumLength(idPurchase, 'idPurchase', 4, res);
        const [isIdPurchaseValid] = await db
            .select('*')
            .from('purchases')
            .where({ id: idPurchase });
        if (isIdPurchaseValid) {
            throw new Error('O id fornecido já pertence a outra compra');
        }

        // => idBuyer
        isString(idBuyer, 'idBuyer', res);
        isNotEmpty(idBuyer, 'idBuyer', res);
        CheckPrefixId(idBuyer, 'idBuyer', 'u', res);
        checkMinimumLength(idBuyer, 'idBuyer', 4, res);
        const [isIdBuyerValid] = await db
            .select('*')
            .from('users')
            .where({ id: idBuyer });
        if (!isIdBuyerValid) {
            throw new Error('O idBuyer fornecido não está registrado');
        }

        // => idProduct
        isString(idProduct, 'idProduct', res);
        isNotEmpty(idProduct, 'idProduct', res);
        CheckPrefixId(idProduct, 'idProduct', 'prod', res);
        checkMinimumLength(idProduct, 'idProduct', 4, res);
        const [isIdProductValid] = await db
            .select('*')
            .from('products')
            .where({ id: idProduct });
        if (!isIdProductValid) {
            throw new Error('O idProduct fornecido não está registrado');
        }

        // => quantity
        isNumber(quantity, 'quantity', res);
        isNotEmpty(quantity, 'quantity', res);

        // => total_price
        const [resultPrice] = await db
            .select('price')
            .from('products')
            .where({ id: idProduct });

        // cálculo
        const resultTotalPrice = Number(resultPrice.price) * Number(quantity);

        // inserindo dados em purchases:
        const newPurchase = {
            id: idPurchase,
            buyer: idBuyer,
            total_price: resultTotalPrice,
        };
        await db('purchases').insert(newPurchase);

        // inserindo dados em purchases_products:
        const newPurchaseProduct = {
            purchase_id: idPurchase,
            product_id: idProduct,
            quantity: quantity,
        };
        await db('purchases_products').insert(newPurchaseProduct);

        res.status(201).send({
            message: 'Pedido realizado com sucesso',
        });
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

// PUT

// 📌 Edit product by id
// ✅ Detalhes revisados!
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newId = req.body.id as string | undefined;
        const newName = req.body.name as string | undefined;
        const newPrice = req.body.price as number | undefined;
        const newDescription = req.body.description as string | undefined;
        const newImageUrl = req.body.imageUrl as string | undefined;

        const [product] = await db('products').where({ id: id });

        if (!product) {
            throw new Error('Não há produtos cadastrados com o id fornecido');
        }

        if (product) {
            if (newId !== undefined) {
                const [verifyNewId] = await db
                    .select('id')
                    .from('products')
                    .where({ id: newId });
                if (verifyNewId) {
                    throw new Error(
                        'O id fornecido já pertence a outro produto'
                    );
                }
                isString(newId, 'Novo Id', res);
                isNotEmpty(newId, 'Novo Id', res);
                CheckPrefixId(newId, 'Novo Id', 'prod', res);
                checkMinimumLength(newId, 'Novo Id', 7, res);
            }

            if (newName !== undefined) {
                isString(newName, 'Novo Name', res);
                isNotEmpty(newName, 'Novo Name', res);
                checkMinimumLength(newName, 'Novo Name', 2, res);
            }

            if (newPrice !== undefined) {
                isNumber(newPrice, 'Novo Preço', res);
                isNotEmpty(newPrice, 'Novo Preço', res);
            }

            if (newDescription !== undefined) {
                isString(newDescription, 'Nova Descrição', res);
                isNotEmpty(newDescription, 'Nova Descrição', res);
                checkMinimumLength(newDescription, 'Nova Descrição', 2, res);
            }

            if (newImageUrl !== undefined) {
                isString(newImageUrl, 'Nova URL da imagem', res);
                isNotEmpty(newImageUrl, 'Nova URL da imagem', res);
                checkMinimumLength(newImageUrl, 'Nova URL da imagem', 2, res);
            }
        }

        await db
            .update({
                id: newId || product.id,
                name: newName || product.name,
                price: newPrice || product.price,
                description: newDescription || product.description,
                image_url: newImageUrl || product.image_url,
            })
            .from('products')
            .where({ id: id });

        res.status(200).send({
            message: 'Produto atualizado com sucesso',
        });
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

// DELETE

// 📌 Delete Purchase By Id
// ✅ Detalhes revisados!
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const [isIdValid] = await db
            .select('*')
            .from('purchases')
            .where({ id: id });

        if (!isIdValid) {
            throw new Error(
                'O id fornecido não corresponde a nenhuma compra registrada'
            );
        }
        await db.delete().from('purchases').where({ id: id });
        res.status(200).send({
            message: 'Pedido cancelado com sucesso',
        });
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
// ✔ Delete user by id
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
