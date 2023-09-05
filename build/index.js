"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
(0, database_1.createUser)('u003', 'Astrodev', 'astrodev@email.com', 'astrodev99');
(0, database_1.getAllUsers)();
(0, database_1.createProduct)('prod003', 'SSD gamer', 349.99, 'Acelere seu sistema com velocidades incríveis de leitura e gravação.', 'https://images.unsplash.com/photo');
(0, database_1.getAllProducts)();
(0, database_1.searchProductsByName)('gamer');
//# sourceMappingURL=index.js.map