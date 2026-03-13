# 📦 Gestão de Estoque Pro (Alpha Tech)

Bem-vindo ao **Gestão de Estoque Pro**! Este sistema foi desenvolvido para facilitar o controle de inventário, permitindo gerenciar produtos, usuários e monitorar movimentações de estoque em tempo real.

---
## 🛠️ O que eu preciso para rodar? (Pré-requisitos)
Para facilitar sua vida, este projeto usa **Docker**. Isso significa que você não precisa instalar o Banco de Dados (PostgreSQL) ou o Node.js manualmente na sua máquina.

1. **Docker Desktop:** [Baixe aqui](https://www.docker.com/products/docker-desktop/) (Certifique-se de que ele esteja aberto antes de começar).
2. **Git:** Para clonar o código.
3. **VS Code:** Para visualizar o código.
---
## 🚀 Passo a Passo para Iniciantes

### 1. Clone o projeto
Abra o terminal e digite:
```
git clone [https://github.com/tassianasc/Gestao-Estoque-Pro.git](https://github.com/tassianasc/Gestao-Estoque-Pro.git)
```
```
cd Gestao-Estoque-Pro
```
### 2. Configure suas credenciais
O projeto precisa de algumas "senhas" para funcionar.

Crie um arquivo chamado `.env` na raiz do projeto.

Copie o conteúdo do arquivo `.env.example` e cole dentro do seu novo `.env`.

Preencha os valores (ex: `DB_PASS=suasenha`).

### 3. Suba o sistema com Docker
No terminal do VS Code, digite:
```
docker-compose up -d
```
O Docker vai baixar as imagens e configurar o banco e o servidor sozinho. Aguarde alguns instantes até que as luzes no Docker Desktop fiquem verdes.

### 4. Onde vejo o sistema funcionando?
Com o Docker rodando, o servidor já está ativo!

* API / Documentação (Swagger): Acesse http://localhost:3000/documentacao

* Lá você pode testar as rotas de login e cadastro direto pelo navegador.
---
### 📊 Visualizando os Dados (DBeaver)
Para ver as tabelas e movimentações como um profissional de dados:

1. Conecte seu **DBeaver** ao `localhost:5432`.

2. Use o usuário e senha que você definiu no seu `.env`.
---
### 🏗️ Arquitetura MVC
Este projeto segue o padrão **Model-View-Controller**, o que o torna organizado e fácil de manter:

- Models: Onde definimos como os dados são salvos no Postgres.

- Controllers: Onde fica a "lógica" (ex: não vender produto sem estoque).

- Routes: Onde definimos os endereços da nossa API.
