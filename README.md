<h1 align="center">labecommerce-backend</h1>
<div align="center">

<!-- ![funcionamento-site-gif](./pokedex/src/assets/images/site.gif) -->

<!-- Clique [aqui](https://project-pokedex-cyan.vercel.app/) para conferir o resultado final! -->

<p align="center"><strong>Status do Projeto:<br></strong> <i>Em Construção</i> 🏗 </p>

<!-- <p>✔</p> -->

</div>

<p align="center">
<span><strong>Tecnologias e Ferramentas utilizadas:</strong></span>
<br>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,typescript,express,git,github,postman" style="height: 25px;"/>
  </a>
</p>

## Índice

-   [1. Resumo do Projeto](#1-resumo-do-projeto)
-   [2. Explicação da API](#2-explicação-da-api)
    -   [2.1 URL Base](#21-url-base)
    -   [2.2 Endpoints](#22-endpoints)
        -   [2.2.1 Recuperar Todos os Usuários](#221-recuperar-todos-os-usuários)
        -   [2.2.2 Recuperar Todos os Produtos](#222-recuperar-todos-os-produtos)
        -   [2.2.3 Criar um Novo Usuário](#223-criar-um-novo-usuário)
        -   [2.2.4 Criar um Novo Produto](#224-criar-um-novo-produto)
        -   [2.2.5 Excluir um Usuário por ID](#225-excluir-um-usuário-por-id)
        -   [2.2.6 Excluir um Produto por ID](#226-excluir-um-produto-por-id)
        -   [2.2.7 Editar um Produto por ID](#227-editar-um-produto-por-id)
    -   [2.3 Tratamento de Erros](#2-3-tratamento-de-erros)

## 1. Resumo do Projeto

## 2. Explicação da API

A API que foi desenvolvida para gerenciar usuários e produtos em um sistema de comércio eletrônico. Ela fornece uma variedade de endpoints que permitem realizar operações como recuperar informações de usuários e produtos, criar novos registros, excluir registros existentes e editar produtos(CRUD).

A API foi desenvolvida utilizando tecnologias como Node.js, TypeScript e Express para criar um servidor robusto e escalável. Além disso, o Git e o GitHub foram utilizados para o controle de versionamento do código fonte, garantindo um desenvolvimento colaborativo e organizado. Para testar os endpoints, a ferramenta Postman pode ser empregada para verificar as respostas da API.

Este projeto está atualmente em construção, e novos recursos e funcionalidades podem ser adicionados no futuro para melhorar sua capacidade e utilidade.

### 2.1 URL Base

A URL base para esta API é `http://localhost:3003`.

### 2.2 Endpoints

[Clique aqui para visualizar a documentação da API](https://documenter.getpostman.com/view/28316385/2s9YCBsofL#038765ca-c528-4237-a382-6730cdccb12c)

A API fornece os seguintes endpoints para interagir com usuários e produtos:

#### 2.2.1 Recuperar Todos os Usuários

-   **Método HTTP:** GET
-   **Descrição:** Recupera uma lista de todos os usuários.
-   **Endpoint:** `http://localhost:3003/users`

#### 2.2.2 Recuperar Todos os Produtos

-   **Método HTTP:** GET
-   **Descrição:** Recupera uma lista de todos os produtos.
-   **Endpoint:** `http://localhost:3003/products`

#### 2.2.3 Criar um Novo Usuário

-   **Método HTTP:** POST
-   **Descrição:** Cria um novo usuário com os dados fornecidos no corpo da solicitação.
-   **Endpoint:** `http://localhost:3003/users`
-   **Parâmetros solicitados:**<br>
    `id`

    -   Tipo: string
    -   Deve ser único
    -   Deve iniciar com "u"
    -   Mínimo de 4 caracteres

    `name`

    -   Tipo: string
    -   Mínimo de 2 caracteres

    `email`

    -   Tipo: string
    -   Deve ser único
    -   Deve usar um dos seguintes provedores: Gmail, Hotmail (Outlook)

    `password`

    -   Tipo: string
    -   Mínimo de 6 dígitos

#### 2.2.4 Criar um Novo Produto

-   **Método HTTP:** POST
-   **Descrição:** Cria um novo produto com os dados fornecidos no corpo da solicitação.
-   **Endpoint:** `http://localhost:3003/products`
-   **Parâmetros solicitados:**<br>
    `id`

    -   Tipo: string
    -   Deve ser único
    -   Deve iniciar com "prod"
    -   Mínimo de 7 caracteres

    `name`

    -   Tipo: string
    -   Mínimo de 2 caracteres

    `price`

    -   Tipo: number

    `description`

    -   Tipo: string

    -   Mínimo de 2 caracteres

    `imageUrl`

    -   Tipo: string

    -   Mínimo de 2 caracteres

#### 2.2.5 Excluir um Usuário por ID

-   **Método HTTP:** DELETE
-   **Descrição:** Exclui um usuário com base no ID fornecido como parâmetro na URL.
-   **Endpoint:** `http://localhost:3003/users/idUser`
-   **Parâmetros solicitados:**<br>
    `id`

#### 2.2.6 Excluir um Produto por ID

-   **Método HTTP:** DELETE
-   **Descrição:** Exclui um produto com base no ID fornecido como parâmetro na URL.
-   **Endpoint:** `http://localhost:3003/products/idProduct`
-   **Parâmetros solicitados:**<br>
    `id`

#### 2.2.7 Editar um Produto por ID

-   **Método HTTP:** PUT
-   **Descrição:** Edita um produto com base no ID fornecido como parâmetro na URL e com os dados fornecidos no corpo da solicitação.
-   **Endpoint:** `http://localhost:3003/products/idProduct`
-   **Parâmetros solicitados:**<br>
    `id`

    -   Opcional
    -   Tipo: string
    -   Deve ser único
    -   Deve iniciar com "prod"
    -   Mínimo de 7 caracteres

    `name`

    -   Opcional
    -   Tipo: string
    -   Mínimo de 2 caracteres

    `price`

    -   Opcional
    -   Tipo: number

    `description`

    -   Opcional
    -   Tipo: string
    -   Mínimo de 2 caracteres

    `imageUrl`

    -   Opcional
    -   Tipo: string
    -   Mínimo de 2 caracteres

### 2. 3 Tratamento de Erros

A API inclui tratamento de erros para lidar com várias situações, como validação de entrada, IDs duplicados e outros erros comuns. Isso garante que a API responda com mensagens de erro adequadas e status HTTP apropriados quando ocorrem problemas.
