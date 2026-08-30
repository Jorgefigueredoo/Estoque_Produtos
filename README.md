# Cadastro de Estoque

Sistema simples de controle de estoque de produtos: cadastro, edição, exclusão e movimentação (entrada e saída) de itens.

## Objetivo

O objetivo do projeto foi construir um back end simples **sem a utilização de IA**, escrevendo tudo à mão para praticar e fixar os fundamentos de Java e Spring Boot.

> **O back end deste projeto foi feito inteiramente à mão, sem a utilização de IA.**
> Toda a API em Spring Boot (model, repository, service, controller, exceptions e configuração) foi escrita manualmente.
> A IA foi usada apenas no front end.

## Tecnologias

**Back end (feito à mão):** Java 21, Spring Boot 4.1.1, Spring Data JPA, Lombok, MySQL
**Front end:** React 19, TypeScript e Vite

## Estrutura

```
Estoque/   -> API REST em Spring Boot
front/     -> interface web (React + TypeScript, build com Vite)
```

## Como rodar

### Banco de dados
Crie o banco no MySQL:

```sql
CREATE DATABASE estoque_produtos;
```

Depois ajuste usuário e senha em `Estoque/src/main/resources/application.properties`.
As tabelas são criadas automaticamente pelo Hibernate (`ddl-auto=update`).

### Back end

```bash
cd Estoque
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

### Front end

```bash
cd front
npm install
npm run dev
```

A interface sobe em `http://127.0.0.1:5500` — origem já liberada no CORS da API.
O host e a porta ficam fixos em `front/vite.config.ts` justamente por causa disso.

Para gerar a versão de produção em `front/dist`:

```bash
npm run build
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Lista todos os produtos |
| POST | `/api/produtos` | Cadastra um produto |
| PUT | `/api/produtos/{id}` | Edita um produto |
| DELETE | `/api/produtos/{id}` | Remove um produto |
| POST | `/api/produtos/{id}/entrada` | Dá entrada no estoque |
| POST | `/api/produtos/{id}/saida` | Dá saída no estoque |

Categorias disponíveis: `ELETRONICOS`, `ROUPAS`, `ALIMENTOS`, `MOVEIS`.

## Regras de negócio

- Não é permitido cadastrar produtos com nome duplicado
- O nome do produto não pode ser alterado depois do cadastro
- A quantidade de entrada/saída precisa ser válida (maior que zero)
- Não é possível dar saída maior que o estoque disponível
