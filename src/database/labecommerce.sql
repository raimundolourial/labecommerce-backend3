-- Active: 1695688856268@@127.0.0.1@3306

-- users --------------------------------------------

-- CREATE:

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

-- READ:

SELECT * FROM users;

-- DELETE:

DROP TABLE users;

-- CREATE:

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'Lily',
        'lily@gmail.com',
        'Lily@123',
        Date()
    ), (
        'u002',
        'Emmy',
        'emmy@gmail.com',
        'Emmy@123',
        Date()
    ), (
        'u003',
        'Alyssa',
        'alyssa@gmail.com',
        'Alyssa@123',
        Date()
    )

-- products --------------------------------------------

-- CREATE:

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

-- READ:

SELECT * FROM products;

-- DELETE:

DROP TABLE products;

-- CREATE:

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod001',
        'Monitor',
        600,
        'Um bom mouse',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod002',
        'Mouse',
        300,
        'Um bom mouse',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod003',
        'Teclado',
        580,
        'Um bom teclado',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod004',
        'Mouse Pad',
        60,
        'Um bom Mouse Pad',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod005',
        'Suporte de Monitor',
        500,
        'Um bom Suporte de Monitor',
        'https://picsum.photos/seed/Monitor/400'
    )

-- CRIANDO QUERIES PARA FUTUROS ENDPOINTS:

-- EXERCÍCIO 1

-- Get All Users

SELECT name FROM users;

-- Get All Products (funcionalidade 1)

SELECT name FROM products;

-- Get all Products (funcionalidade 2)

SELECT name FROM products WHERE name LIKE '%monitor%';

-- EXERCÍCIO 2

-- Create User

INSERT INTO users
VALUES (
        'u004',
        'Atlas',
        'atlas@gmail.com',
        'Atlas@123',
        Date()
    )

-- Create Product

INSERT INTO products
VALUES (
        'prod006',
        'Teclado Mecânico',
        1600,
        'Um bom teclado mecânico',
        'https://picsum.photos/seed/tecladoMecanico/400'
    )

-- EXERCÍCIO 3

-- Delete User by id

DELETE FROM users WHERE id = 'u001' 

-- Delete Product by id

DELETE FROM products WHERE id = 'prod001' 

-- Edit Product by id

UPDATE products
SET
    id = 'prod007',
    name = 'Mouse Gamer Com Led',
    price = 350,
    description = 'Um bom mouse pad gamer com led',
    image_url = 'https://picsum.photos/seed/mouseGamer/400'
WHERE id = 'prod002';