# 📦 Gestão de Estoque Pro

Uma API robusta para controle de inventário desenvolvida com foco em **auditoria de movimentações** e **escalabilidade**. O sistema permite a gestão completa de produtos, usuários e alertas de estoque crítico.

---

## 🏗️ Arquitetura e Padrões
Este projeto utiliza o padrão **MVC (Model-View-Controller)** para garantir a separação de responsabilidades:
* **Model:** Camada de persistência que lida diretamente com o PostgreSQL via queries SQL otimizadas.
* **Controller:** Responsável pela lógica de negócio e validação de regras (ex: não permitir saída maior que o estoque atual).
* **Routes/View:** Interface exposta via API REST, documentada com **Swagger (OpenAPI)**.



## 🛠️ Tecnologias e Ferramentas
* **Node.js & Fastify:** Escolhido pela alta performance e baixo overhead em comparação ao Express.
* **PostgreSQL:** Banco de dados relacional para garantir a integridade referencial (Foreign Keys).
* **Docker & Docker Compose:** Containerização de toda a infraestrutura, garantindo que o projeto rode identicamente em qualquer máquina.
* **JWT (JSON Web Token):** Sistema de autenticação para proteção de rotas sensíveis.
* **Swagger:** Documentação interativa para testes rápidos de endpoints.

---

## 🐳 Como rodar com Docker (Passo a Passo)

Ideal para desenvolvedores que desejam subir o ambiente em segundos sem configurar o banco de dados manualmente.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/Gestao-Estoque-Pro.git](https://github.com/SEU_USUARIO/Gestao-Estoque-Pro.git)
    cd Gestao-Estoque-Pro
    ```

2.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz seguindo o modelo:
    ```env
    DB_USER=admin
    DB_PASS=sua_senha
    DB_NAME=sistema_estoque
    DB_HOST=db
    DB_PORT=5432
    JWT_SECRET=sua_chave_secreta
    ```

3.  **Suba os containers:**
    ```bash
    docker-compose up -d
    ```

4.  **Acesse a Documentação:**
    Vá em [http://localhost:3000/documentacao](http://localhost:3000/documentacao) para testar o sistema.

---

## 📊 Gestão de Dados Recomendada
Para visualizar o banco de dados deste projeto, recomendamos o uso do **DBeaver** ou **pgAdmin 4**, conectando via `localhost:5432` com as credenciais definidas no seu `.env`.
