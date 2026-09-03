# Sistema de Gestão de Chamados Técnicos — Backend (Fase 1)

Backend do sistema de chamados técnicos (help desk interno), desenvolvido com **Node.js + Express**, **MongoDB (Mongoose)**, APIs **REST** e **GraphQL (Apollo Server)**, com autenticação e autorização via **JWT**.

## 📌 Sobre o projeto

Aplicação para centralizar o registro, acompanhamento e resolução de chamados técnicos internos de uma empresa, permitindo priorização, atribuição a técnicos responsáveis e histórico completo de atendimentos.

**Público-alvo:** funcionários (abrem chamados), técnicos (atendem), administrador (gerencia usuários e categorias).

## 🗂 Entidades

| Entidade | Descrição |
|---|---|
| Usuário | nome, e-mail, senha (criptografada), papel (funcionario / tecnico / admin) |
| Categoria | tipo de problema (hardware, software, rede...) |
| Chamado | título, descrição, categoria, prioridade, status, solicitante, técnico responsável |
| Comentário | histórico de interações dentro de um chamado |

## 🛠 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- Apollo Server (GraphQL) + REST
- JWT (jsonwebtoken) + bcryptjs
- dotenv, cors

## 📁 Estrutura de pastas

```
src/
├── config/
│   └── db.js              # conexão com o MongoDB
├── controllers/            # lógica de negócio das rotas REST
├── graphql/
│   ├── typeDefs.js         # schema GraphQL
│   ├── resolvers.js        # resolvers GraphQL
│   └── context.js          # extrai usuário autenticado do token
├── middleware/
│   └── auth.js             # autenticar (JWT) e autorizar (por papel)
├── models/                  # schemas do Mongoose
├── routes/                  # rotas REST (Express Router)
├── seed.js                  # popula admin + categorias iniciais
└── server.js                 # ponto de entrada da aplicação
```

## 🚀 Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o `.env.example` para `.env` e ajuste os valores (principalmente `MONGODB_URI` e `JWT_SECRET`):
   ```bash
   cp .env.example .env
   ```

3. Certifique-se de ter o MongoDB rodando localmente (ou use uma URI do MongoDB Atlas).

4. (Opcional, mas recomendado) rode o seed para criar um usuário admin e categorias iniciais:
   ```bash
   npm run seed
   ```
   Isso cria: `admin@chamados.com` / senha `admin123`

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

A API sobe em `http://localhost:4000`, e o GraphQL fica disponível em `http://localhost:4000/graphql`.

## 🔗 Endpoints REST

### Autenticação
```
POST /auth/login          { email, senha }  → retorna { token, usuario }
```

### Usuários
```
POST   /usuarios          (público — cadastro)
GET    /usuarios          (admin)
GET    /usuarios/:id      (autenticado)
PUT    /usuarios/:id      (admin)
DELETE /usuarios/:id      (admin)
```

### Categorias
```
GET    /categorias        (autenticado)
GET    /categorias/:id    (autenticado)
POST   /categorias        (admin)
PUT    /categorias/:id    (admin)
DELETE /categorias/:id    (admin)
```

### Chamados
```
POST   /chamados                    (autenticado — qualquer papel)
GET    /chamados                    (autenticado — filtros: ?status=&prioridade=&categoria=&tecnicoResponsavel=)
GET    /chamados/:id                (autenticado)
PUT    /chamados/:id                (autenticado — dono ou técnico/admin)
PATCH  /chamados/:id/status         (técnico ou admin)
DELETE /chamados/:id                (admin)
POST   /chamados/:id/comentarios    (autenticado)
GET    /chamados/:id/comentarios    (autenticado)
```

Todas as rotas autenticadas exigem o header:
```
Authorization: Bearer <token>
```

## 🔮 GraphQL

Endpoint: `POST /graphql`

Exemplo de query (chamados filtrados, com relacionamentos):
```graphql
query {
  chamados(filtro: { status: "aberto", prioridade: "alta" }) {
    id
    titulo
    status
    prioridade
    categoria { nome }
    solicitante { nome email }
    tecnicoResponsavel { nome }
    comentarios { texto autor { nome } }
  }
}
```

Exemplo de mutation:
```graphql
mutation {
  criarChamado(
    titulo: "Impressora não funciona"
    descricao: "Impressora do setor financeiro não liga"
    categoria: "ID_DA_CATEGORIA"
    prioridade: "alta"
  ) {
    id
    status
  }
}
```

O header `Authorization: Bearer <token>` também é obrigatório nas requisições GraphQL autenticadas.

## 🔒 Regras de autorização

| Ação | Papéis permitidos |
|---|---|
| Abrir chamado | funcionário, técnico, admin |
| Ver todos os chamados | técnico, admin |
| Ver apenas os próprios chamados | funcionário |
| Alterar status/atribuir técnico | técnico, admin |
| Gerenciar usuários | admin |
| Gerenciar categorias | admin |
| Remover chamado | admin |
