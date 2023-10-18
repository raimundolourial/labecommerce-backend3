import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import { TProducts, TUsers } from './types';
import {
    checkEmail,
    checkPrefixId,
    checkMinimumLength,
    isNotEmpty,
    isNumber,
    isString,
} from './validations';

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003');
});

// ✔ ====> endpoints for users:

// 📌 Get all users
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

// 📌 Create user
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password }: TUsers = req.body;

        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db
            .select('id')
            .from('users')
            .where({ id: id });
        if (verifyId) {
            throw new Error('O id precisa ser único');
        }
        checkPrefixId(id, 'Id', 'u', res);
        checkMinimumLength(id, 'Id', 4, res);

        isString(name, 'Name', res);
        isNotEmpty(name, 'Name', res);
        checkMinimumLength(name, 'Name', 2, res);

        isString(email, 'Email', res);
        isNotEmpty(email, 'Email', res);
        const [verifyEmail] = await db
            .select('email')
            .from('users')
            .where({ email: email });
        if (verifyEmail) {
            throw new Error('O email precisa ser único');
        }
        checkEmail(email, 'Email', res);

        isString(password, 'Senha', res);
        isNotEmpty(password, 'Senha', res);
        checkMinimumLength(password, 'Senha', 6, res);

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

// ✔ ====> endpoints for products:

// 📌 Create product
app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl }: TProducts = req.body;

        isString(id, 'Id', res);
        isNotEmpty(id, 'Id', res);
        const [verifyId] = await db
            .select('id')
            .from('products')
            .where({ id: id });
        if (verifyId) {
            throw new Error('O id precisa ser único');
        }
        checkPrefixId(id, 'Id', 'prod', res);
        checkMinimumLength(id, 'Id', 7, res);

        isString(name, 'Name', res);
        isNotEmpty(name, 'Name', res);
        checkMinimumLength(name, 'Name', 2, res);

        isNumber(price, 'Preço', res);

        isString(description, 'Descrição', res);
        isNotEmpty(description, 'Descrição', res);
        checkMinimumLength(description, 'Descrição', 2, res);

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

// 📌 Get all products (funcionalidade 1 e 2)
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

// 📌 Edit product by id
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
                checkPrefixId(newId, 'Novo Id', 'prod', res);
                checkMinimumLength(newId, 'Novo Id', 7, res);
            }

            if (newName !== undefined) {
                isString(newName, 'Novo Name', res);
                checkMinimumLength(newName, 'Novo Name', 2, res);
            }

            if (newPrice !== undefined) {
                isNumber(newPrice, 'Novo Preço', res);
            }

            if (newDescription !== undefined) {
                isString(newDescription, 'Nova Descrição', res);
                checkMinimumLength(newDescription, 'Nova Descrição', 2, res);
            }

            if (newImageUrl !== undefined) {
                isString(newImageUrl, 'Nova URL da imagem', res);
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

// ✔ ====> endpoints for purchases:

// 📌 Create purchase
app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { idPurchase, idBuyer, idProduct, quantity } = req.body;

        isString(idPurchase, 'idPurchase', res);
        isNotEmpty(idPurchase, 'idPurchase', res);
        checkPrefixId(idPurchase, 'idPurchase', 'pur', res);
        checkMinimumLength(idPurchase, 'idPurchase', 6, res);

        isString(idBuyer, 'idBuyer', res);
        isNotEmpty(idBuyer, 'idBuyer', res);
        checkPrefixId(idBuyer, 'idBuyer', 'u', res);
        checkMinimumLength(idBuyer, 'idBuyer', 4, res);
        const [isIdBuyerValid] = await db
            .select('*')
            .from('users')
            .where({ id: idBuyer });
        if (!isIdBuyerValid) {
            throw new Error('O idBuyer fornecido não está registrado');
        }

        isString(idProduct, 'idProduct', res);
        isNotEmpty(idProduct, 'idProduct', res);
        checkPrefixId(idProduct, 'idProduct', 'prod', res);
        checkMinimumLength(idProduct, 'idProduct', 4, res);
        const [isIdProductValid] = await db
            .select('*')
            .from('products')
            .where({ id: idProduct });
        if (!isIdProductValid) {
            throw new Error('O idProduct fornecido não está registrado');
        }

        isNumber(quantity, 'quantity', res);
        isNotEmpty(quantity, 'quantity', res);

        const [resultPrice] = await db
            .select('price')
            .from('products')
            .where({ id: idProduct });

        const resultTotalPrice = Number(resultPrice.price) * Number(quantity);

        // Verificando se o id da compra pertence ao id do comprador especificado:
        const [existingPurchase] = await db
            .select('*')
            .from('purchases')
            .where({ id: idPurchase });

        if (existingPurchase) {
            if (existingPurchase.buyer !== idBuyer) {
                throw new Error(
                    'O ID de compra fornecido já pertence a outro comprador'
                );
            } else {
                // Atualizando o "total_price" de "purchases":
                const newTotalPrice =
                    Number(existingPurchase.total_price) + resultTotalPrice;

                await db('purchases')
                    .where({ id: idPurchase })
                    .update({ total_price: newTotalPrice });

                // Inserir um novo registro na tabela "purchases_products":
                const newPurchaseProduct = {
                    purchase_id: idPurchase,
                    product_id: idProduct,
                    quantity: quantity,
                };
                await db('purchases_products').insert(newPurchaseProduct);

                res.status(201).send({
                    message: 'Pedido realizado com sucesso',
                });
            }
        } else {
            // Inserir um novo registro na tabela "purchases":
            const newPurchase = {
                id: idPurchase,
                buyer: idBuyer,
                total_price: resultTotalPrice,
            };
            await db('purchases').insert(newPurchase);

            // Inserir um novo registro na tabela "purchases_products":
            const newPurchaseProduct = {
                purchase_id: idPurchase,
                product_id: idProduct,
                quantity: quantity,
            };
            await db('purchases_products').insert(newPurchaseProduct);
            res.status(201).send({
                message: 'Pedido realizado com sucesso',
            });
        }
    } catch (error) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// 📌 Delete purchase by id
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

// 📌 Get purchase by id
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
