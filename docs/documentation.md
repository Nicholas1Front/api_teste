
# 📘 Documentação – API Simples de Pedidos

## 📌 Stack do Projeto

A API foi desenvolvida utilizando as seguintes tecnologias:

- **Node.js + Express** — estrutura principal da aplicação  
- **PostgreSQL** — banco de dados relacional  
- **Neon** — hospedagem do banco de dados  
- **Render** — deploy da API como Web Service  
- **Knex.js** — query builder para comunicação com o banco  
- **JWT (JSON Web Token)** — autenticação e autorização  
- **Zod** — validação de dados de entrada  
- **bcrypt** — hash de senhas  
- **Postman** — execução de testes manuais  

---

# 📦 Módulos do Projeto

A API foi dividida em módulos para organização e separação de responsabilidades.

## 🔐 Auth / Users

Responsável por:

- Registro de usuários  
- Login  
- Geração de token JWT para acesso às rotas protegidas  

Após o login, o usuário recebe um **token JWT** que deve ser enviado no header das requisições protegidas.

---

## 📦 Items

Gerencia os itens disponíveis no sistema.

Permite:

- Criar itens  
- Atualizar itens  
- Buscar itens  
- Deletar itens  

Os itens podem ser criados **diretamente pelo usuário** ou **automaticamente durante a criação de pedidos**, caso ainda não existam.

---

## 🧾 Orders

Responsável pela gestão de pedidos.

Permite:

- Criar pedidos  
- Atualizar pedidos  
- Consultar pedidos  
- Excluir pedidos  

Cada pedido possui:

- `id`
- `name`
- `user_id`
- `total_price`
- lista de itens associados

---

## 🔗 Order_Items

Tabela intermediária responsável por relacionar **pedidos com itens**.

Armazena:

- `order_id`
- `item_id`
- `quantity`
- `price`

Isso permite que:

- um pedido tenha **vários itens**
- um item possa aparecer em **vários pedidos**

---

## 🛠 Dev

Módulo utilizado apenas em ambiente de desenvolvimento.

Responsável por:

- resetar o banco de dados  
- limpar tabelas  
- resetar ids  

Esse módulo **não deve ser utilizado em ambientes de produção reais**.

---

# 🔄 Fluxo da Aplicação

A API simula um **sistema simples de pedidos**.

## 1️⃣ Cadastro

O usuário cria uma conta informando:

- nome  
- email  
- senha  

A senha é armazenada utilizando **hash bcrypt**.

---

## 2️⃣ Login

O usuário realiza login informando:

- email  
- senha  

Se os dados estiverem corretos, a API retorna um **token JWT**.

Esse token deve ser enviado no header das requisições:
```
Authorization: Bearer TOKEN_AQUI
```

---

## 3️⃣ Criação de Itens

O usuário pode criar itens que serão utilizados em pedidos.

Exemplo de item:

- `name`
- `description`
- `price`
- `quantity_available`

Caso o usuário não crie previamente, os itens podem ser **criados automaticamente durante a criação de pedidos**.

---

## 4️⃣ Criação de Pedidos

O pedido representa o **núcleo do sistema**.

Ao criar um pedido o usuário envia:

- nome (opcional)
- lista de itens

Exemplo de payload:

```json
{
  "name": "Pedido Teste",
  "items": [
    {
      "name": "Mouse",
      "price": 100,
      "quantity": 2
    },
    {
      "name": "Keyboard",
      "price": 200,
      "quantity": 1
    }
  ]
}
````

---

## Regras aplicadas durante a criação

Durante o processo de criação de pedidos a API executa as seguintes etapas:

1. verifica se os itens existem no banco
2. caso não existam, cria automaticamente
3. calcula o valor total do pedido
4. salva o pedido na tabela `orders`
5. relaciona os itens através da tabela `order_items`
6. atualiza o estoque de cada item

Resposta esperada:

```json
{
  "id": 1,
  "user_id": 1,
  "name": "Pedido Teste",
  "total_price": 400,
  "items": [...]
}
```

---

# ⚠️ Observações

Devido ao tempo disponível para desenvolvimento:

* não foi implementado **status de pedidos** (`pending`, `completed`, `cancelled`)
* algumas melhorias podem ser incluídas futuramente

Possíveis melhorias:

* status de pedidos
* paginação de resultados
* transações no banco de dados
* logs estruturados
* documentação automática (Swagger / OpenAPI)

---

# 🤖 Uso de IA no Projeto

Ferramentas de IA foram utilizadas para:

* auxiliar na interpretação da arquitetura
* ajudar na resolução de bugs pontuais
* auxiliar na inicialização da estrutura do projeto
* ajudar na produção da documentação

A lógica de negócio principal e implementação das funcionalidades foram desenvolvidas manualmente.

---

# Outros Projetos

Muitos módulos utilizados apenas refatorei deste projeto abaixo, pois estou desenvolvendo um SAAS que também dispõe de alguns módulos parecidos com esta API

[https://github.com/Nicholas1Front/emeg_system](https://github.com/Nicholas1Front/emeg_system)

---

# 🧪 Testes

Os testes da API foram realizados utilizando **Postman**.

As coleções de testes incluem:

* rotas de autenticação
* rotas de itens
* rotas de pedidos
* testes de criação e manipulação de dados

Essas coleções podem ser importadas para facilitar a reprodução dos testes.

---

# 🚀 Melhorias Futuras

Possíveis evoluções para o projeto:

* implementação de **status de pedidos**
* utilização de **transactions no Knex**
* paginação nas listagens
* cache para consultas frequentes
* documentação com **Swagger**
* testes automatizados com **Jest / Supertest**
