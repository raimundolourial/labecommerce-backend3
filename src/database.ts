import { TProducts, TUsers } from './types';

export const users: TUsers[] = [
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

export const products: TProducts[] = [
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

// ✔ User:
export const createUser = (
    id: string,
    name: string,
    email: string,
    password: string
): void => {
    const newRegister: TUsers = {
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toLocaleString(),
    };
    users.push(newRegister);
    console.log('📌 createUser: ', 'Cadastro realizado com sucesso');
};

export const getAllUsers = (): void => {
    // Retorna TODAS as informações:
    console.log('📌 getAllUsers:', users);

    // Retorna APENAS O NOME:
    // const namesUsers = users.map((user) => {
    //     return user.name;
    // });
    // console.log('📌 getAllUsers:', namesUsers);
};

// ✔ Product:
export const createProduct = (
    id: string,
    name: string,
    price: number,
    description: string,
    imageUrl: string
) => {
    const newRegister: TProducts = {
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl,
    };
    products.push(newRegister);
    console.log('📌 createProduct', 'Produto criado com sucesso');
};

export const getAllProducts = () => {
    console.log('📌 getAllProducts:', products);
};

export const searchProductsByName = (name: string): void => {
    let productFound = false;

    products.forEach((product) => {
        if (product.name.toLowerCase().includes(name.toLowerCase())) {
            console.log('📌 searchProductsByName:', product);
            productFound = true;
        }
    });

    if (!productFound) {
        console.log('📌 searchProductsByName:', 'Produto NÃO encontrado');
    }
};
