# Fluxor Quote Services Backend

Backend do projeto Fluxor, organizado como monorepo com foco em:

- API HTTP com Fastify
- modelagem por dominio
- validacao compartilhada com Zod
- persistencia com Drizzle ORM
- migrations em PostgreSQL

## Visao Geral

Este repositorio contem o backend da aplicacao Fluxor e alguns pacotes internos usados pelo projeto.

Hoje a estrutura principal e:

- `backend`
  API Fastify, casos de uso, controllers, middlewares e infraestrutura.
- `packages/drizzle`
  Schema compartilhado do banco, build do pacote e migrations do Drizzle.
- `packages/zod`
  Schemas Zod compartilhados para validacao de entrada.
- `packages/tests`
  Suite de testes automatizados.

## Stack

- Node.js
- pnpm workspaces
- TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Zod
- Docker Compose

## Arquitetura

O projeto segue uma separacao por camadas:

- `domain`
  Entidades, contratos de repositorio e casos de uso.
- `infra`
  HTTP, banco de dados, storage e integracoes.
- `shared`
  servicos utilitarios e erros compartilhados.

O objetivo e manter as regras de negocio no dominio, enquanto validacao HTTP, persistencia e detalhes de framework ficam na infraestrutura.

## Pre-requisitos

Antes de rodar o projeto, tenha instalado:

- Node.js 20+ ou superior
- pnpm
- Docker e Docker Compose

Se quiser rodar o banco fora do Docker, tambem funciona, desde que o `DATABASE_URL` aponte para um PostgreSQL valido.

## Estrutura de Ambiente

O projeto usa variaveis de ambiente no arquivo `.env`.

Exemplo de desenvolvimento:

```env
PORT="4001"
DATABASE_URL="postgresql://igorkaliel:fluxor123@localhost:5432/fluxor"
JWT_SECRET="BASE64_SECRET_HERE"
JWT_REFRESH_SECRET="BASE64_REFRESH_SECRET_HERE"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
LOCAL_NETWORK_IP="192.168.15.9"
FRONTEND_URL="http://192.168.15.9:8081"
NODE_ENV="development"
```

Arquivos de referencia:

- [.env.development.example](/c:/Users/ikali.000/Documents/projects/quote-services-backend/.env.development.example)
- [.env.production.example](/c:/Users/ikali.000/Documents/projects/quote-services-backend/.env.production.example)

## Subindo o Banco com Docker

O repositorio possui um `docker-compose.yml` com PostgreSQL pronto para desenvolvimento local.

Arquivo:

- [docker-compose.yml](/c:/Users/ikali.000/Documents/projects/quote-services-backend/docker-compose.yml)

Para subir o banco:

```bash
pnpm run db:up
```

Isso vai iniciar um container com:

- banco: `fluxor`
- usuario: `igorkaliel`
- senha: `fluxor123`
- porta: `5432`

Para derrubar o banco:

```bash
pnpm run db:down
```

## Passo a Passo Completo

### 1. Instale as dependencias

Na raiz do projeto:

```bash
pnpm install
```

### 2. Configure o `.env`

Se ainda nao existir, crie o arquivo `.env` com base no exemplo de desenvolvimento.

O valor mais importante para a fase inicial e:

```env
DATABASE_URL="postgresql://igorkaliel:fluxor123@localhost:5432/fluxor"
```

### 3. Suba o PostgreSQL

```bash
pnpm run db:up
```

Se quiser confirmar que o container subiu:

```bash
docker compose ps
```

### 4. Gere ou revise as migrations

Se voce alterou o schema do Drizzle e quer gerar uma nova migration:

```bash
pnpm run db:generate
```

As migrations ficam em:

- [packages/drizzle/drizzle](/c:/Users/ikali.000/Documents/projects/quote-services-backend/packages/drizzle/drizzle)

### 5. Aplique as migrations no banco

```bash
pnpm run db:migrate
```

Esse passo cria as tabelas no PostgreSQL com base nas migrations geradas pelo Drizzle.

### 6. Popule o banco com dados iniciais

```bash
pnpm --filter @fluxor/backend run seed
```

Esse seed cria:

- usuario inicial
- clientes
- categorias
- orcamentos

### 7. Rode a API em desenvolvimento

```bash
pnpm run dev:backend
```

Por padrao, a API sobe na porta `4001`.

## Endpoints Uteis

Depois de iniciar a aplicacao:

- Health check:
  `GET /health`
- Swagger:
  `GET /docs`

URLs locais mais comuns:

- API:
  `http://localhost:4001`
- Health:
  `http://localhost:4001/health`
- Swagger:
  `http://localhost:4001/docs`

## Comandos Principais

### Banco

```bash
pnpm run db:up
pnpm run db:down
pnpm run db:generate
pnpm run db:migrate
```

### Desenvolvimento

```bash
pnpm run dev:backend
```

### Build

```bash
pnpm run build
```

Esse comando compila:

- `packages/zod`
- `packages/drizzle`
- `backend`

### Testes

```bash
pnpm run test
```

## Pacotes Internos

### `packages/zod`

Centraliza schemas de validacao compartilhados.

Exemplo de uso atual:

- validacao de login
- validacao de registro

### `packages/drizzle`

Centraliza:

- schema do banco
- exportacoes do Drizzle
- migrations

Arquivos importantes:

- [schema.ts](/c:/Users/ikali.000/Documents/projects/quote-services-backend/packages/drizzle/src/db/schema.ts)
- [drizzle.config.ts](/c:/Users/ikali.000/Documents/projects/quote-services-backend/packages/drizzle/drizzle.config.ts)

## Fluxo de Desenvolvimento Recomendado

Quando voce alterar o schema do banco:

1. edite o schema em `packages/drizzle/src/db/schema.ts`
2. gere a migration com `pnpm run db:generate`
3. aplique com `pnpm run db:migrate`
4. rode a API
5. ajuste seed e testes, se necessario

Quando voce alterar validacoes compartilhadas:

1. edite `packages/zod`
2. rode `pnpm run build`
3. valide a API

## Troubleshooting

### `ECONNREFUSED` ao rodar migration

Normalmente significa que o PostgreSQL nao esta rodando ou o `DATABASE_URL` esta errado.

Checklist:

- rode `pnpm run db:up`
- confirme `docker compose ps`
- confira o `DATABASE_URL`
- veja se a porta `5432` nao esta ocupada por outro banco

### `Permission denied (publickey)` no git

Esse erro e de autenticacao com o remoto GitHub e nao tem relacao com o backend.

### `vitest` nao encontrado

Se os testes falharem por dependencia ausente, rode novamente:

```bash
pnpm install
```

### Alterei o schema e nada mudou no banco

Voce provavelmente esqueceu uma destas etapas:

1. `pnpm run db:generate`
2. `pnpm run db:migrate`

## Observacoes Importantes

- O backend usa PostgreSQL com Drizzle como camada de persistencia.
- O projeto nao depende mais da antiga infraestrutura SQLite para o fluxo principal.
- Os contratos compartilhados de validacao ficam em `packages/zod`.
- As migrations geradas devem ser versionadas no repositorio.

## Resumo Rapido

Se voce quer apenas subir tudo o mais rapido possivel:

```bash
pnpm install
pnpm run db:up
pnpm run db:migrate
pnpm --filter @fluxor/backend run seed
pnpm run dev:backend
```

Depois abra:

```text
http://localhost:4001/docs
```
