# tech_hub_api
Este projeto consiste em uma api de armazenamento de registro de compra de produtos e vendas.

## Rodar localmente
#### 1. Clone o projeto
    git clone https://github.com/RafaelFernandes12/tech_hub_API.git
#### 2. Abra a pasta do projeto
    cd tech-hub-api/
#### 3. Entre na pasta root, crie um arquivo .env e passe a string de conexão do banco
    DATABASE_URL="mysql://root:root@localhost:3306/tech_hub?schema=public"
Estas são as configurações padrões do mysql, caso o seu mysql possua outras configurações, modifique a string como desejar

    DATABASE_URL="mysql://MYSQL_ROOT:MYSQL_PASSWORD@localhost:MYSQL_PORT/tech_hub?schema=public"
#### 3. Rode o projeto
    npm run dev

## Ferramentas
* Fastify js
* Node js
* Prisma
* Mysql
* Typescript