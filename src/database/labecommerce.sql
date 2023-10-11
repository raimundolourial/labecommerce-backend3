-- Active: 1697050904632@@127.0.0.1@3306

-- =========================================> users <=========================================

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT (
            strftime(
                '%d-%m-%Y %H:%M:%S',
                'now',
                'localtime'
            )
        ) NOT NULL
    );

SELECT * FROM users;

DROP TABLE users;

INSERT INTO
    users (id, name, email, password)
VALUES (
        'u001',
        'Lily',
        'lily@gmail.com',
        'Lily@123'
    ), (
        'u002',
        'Emmy',
        'emmy@gmail.com',
        'Emmy@123'
    ), (
        'u003',
        'Alyssa',
        'alyssa@gmail.com',
        'Alyssa@123'
    )

-- =========================================> products <=========================================

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT * FROM products;

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

-- ==============================> CRIANDO VISUALIZAÇÕES PARA FUTUROS ENDPOINTS <==============================

-- ==========================================> users e products <==============================================

-- Get All Users

SELECT name FROM users;

SELECT * FROM products;

-- Get All Products (funcionalidade 1)

SELECT name FROM products;

-- Get all Products (funcionalidade 2)

SELECT name FROM products WHERE name LIKE '%monitor%';

-- Create User

INSERT INTO
    users (id, name, email, password)
VALUES (
        'u004',
        'Atlas',
        'atlas@gmail.com',
        'Atlas@123'
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

-- Delete User by id

DELETE FROM users WHERE id = 'u001' 

-- Delete Product by id

DELETE FROM products WHERE id = 'prod001' 

-- Edit Product by id

-- ATENÇÃO -> ESSE COMANDO MUDA O ID, PORTANTO, SE EXECUTADA O ID 'prod002' não existe mais!

-- UPDATE products

-- SET

--     id = 'prod007',

--     name = 'Mouse Gamer Com Led',

--     price = 350,

--     description = 'Um bom mouse pad gamer com led',

--     image_url = 'https://picsum.photos/seed/mouseGamer/400'

-- WHERE id = 'prod002';

-- =========================================> purchases <=========================================

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT DATETIME DEFAULT (
            strftime(
                '%d-%m-%Y %H:%M:%S',
                'now',
                'localtime'
            )
        ) NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    purchases (id, buyer, total_price)
VALUES ('pur001', 'u001', '150.00'), ('pur002', 'u002', '250.00'), ('pur003', 'u003', '350.00'), ('pur004', 'u004', '450.00');

DROP TABLE purchases;

SELECT * FROM purchases;

UPDATE purchases SET total_price = 120.00 WHERE id = 'pur001';

SELECT
    purchases.id AS purchases_id,
    buyer AS buyer_id,
    users.name AS buyer_name,
    users.email AS email,
    total_price,
    purchases.created_at
FROM users
    INNER JOIN purchases ON buyer = users.id;

-- =========================================> purchases_products <=========================================

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    purchases_products (
        purchase_id,
        product_id,
        quantity
    )
VALUES ('pur001', 'prod002', 2), ('pur002', 'prod001', 5), ('pur003', 'prod003', 1);

SELECT * FROM purchases_products;

-- Informações mais relevantes:

SELECT
    purchase_id AS IdDaCompra,
    product_id AS IdDoProduto,
    products.name AS NomeDoProduto,
    quantity AS QuantidadeComprada,
    price AS PreçoUnitario
FROM purchases_products
    INNER JOIN products ON purchases_products.product_id = products.id
    INNER JOIN purchases ON purchases_products.purchase_id = purchases.id

-- Todas as informações das três tabelas:

SELECT *
FROM purchases_products
    INNER JOIN products ON purchases_products.product_id = products.id
    INNER JOIN purchases ON purchases_products.purchase_id = purchases.id