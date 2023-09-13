"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
(0, database_1.createUser)('u003', 'Astrodev', 'astrodev@email.com', 'astrodev99');
(0, database_1.getAllUsers)();
(0, database_1.createProduct)('prod003', 'SSD gamer', 349.99, 'Acelere seu sistema com velocidades incríveis de leitura e gravação.', 'https://images.unsplash.com/photo');
(0, database_1.getAllProducts)();
(0, database_1.searchProductsByName)('gamer');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003');
});
app.get('/ping', (req, res) => {
    res.send('Pong!');
});
//# sourceMappingURL=index.js.map