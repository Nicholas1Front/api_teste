
# 🧾 API Simples de Pedidos

Uma API simples para gerenciamento de **usuários, itens e pedidos**, construída com **Node.js + Express**, utilizando **PostgreSQL**, **Knex**, **Zod**, **JWT** e hospedada no **Render**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js + Express**
- **PostgreSQL** (Neon)
- **Knex.js** (Query Builder)
- **JWT** para autenticação
- **Zod** para validação
- **bcrypt** para hashing de senhas
- **Render** (deploy)
- **Postman** (testes)

---

## 📦 Funcionalidades Principais

### 🔐 Auth
- Registro de usuário
- Login
- Retorno de token JWT
- Acesso a rotas protegidas

### 📦 Items
- Criar item
- Listar itens
- Atualizar item
- Deletar item

### 🧾 Orders
- Criar pedido com itens associados
- Atualizar pedido
- Listar pedidos
- Deletar pedido
- Cálculo automático do `total_price`
- Criação automática de itens inexistentes

### 🔗 Order_Items
- Relaciona pedidos e itens
- Armazena quantidade e preço
- Suporta CRUD básico

---

## 📂 Estrutura Geral

```

/src
/modules
/auth
/users
/items
/orders
/order_items
/database
/middlewares
/utils
/docs
documentation.md

````

---

## ▶️ Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` com:

```
DATABASE_URL=postgres://...
JWT_SECRET=SUA_CHAVE_AQUI
```

### 4. Execute migrações do banco

```bash
npx knex migrate:latest
```

### 5. Inicie o servidor

```bash
npm run dev
```

---

## 📮 Testes com Postman

Uma collection do Postman está disponível na pasta:

```
/docs/postman_collection.json
```

Basta importar no Postman e testar as rotas.

---

## 📘 Documentação Completa

A documentação detalhada do projeto está disponível em:

```
/docs/documentation.md
```

---

## Outros Projetos

Caso queira ver outro projeto em desenvolvimento:
[https://github.com/Nicholas1Front/emeg_system](https://github.com/Nicholas1Front/emeg_system)

---

## 📜 Licença

MIT License




