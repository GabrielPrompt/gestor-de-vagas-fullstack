# Gestor de Vagas – Teste Técnico

Aplicação fullstack para gerenciamento de vagas e candidaturas, com autenticação JWT, controle de perfis e fluxo completo de criação, candidatura, aprovação e feedback.

---

## 📦 Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT)
- JPA / Hibernate
- MySQL
- Maven
- Docker

### Frontend
- HTML
- CSS
- JavaScript
- Nginx (Docker)

---

## 🔐 Chaves JWT

Por motivos de segurança, as chaves JWT **não são versionadas no repositório**.

O backend **depende obrigatoriamente** dessas chaves para iniciar corretamente.

### Arquivos esperados em runtime
backend/src/main/resources/app.key  
backend/src/main/resources/app.pub

### Arquivos de exemplo (versionados)
backend/src/main/resources/app.key.example  
backend/src/main/resources/app.pub.example

Antes de subir os containers, gere suas próprias chaves JWT com base nos arquivos de exemplo
e salve os arquivos finais (`app.key` e `app.pub`) no caminho acima.

--- 

### ⚠️ Passo importante (obrigatório)

Antes de subir os containers, gere as chaves JWT e salve os arquivos:

backend/src/main/resources/app.key  
backend/src/main/resources/app.pub

Utilize como base os arquivos de exemplo:

backend/src/main/resources/app.key.example  
backend/src/main/resources/app.pub.example

## COMO GERAR AS CHAVES JWT ?

Execute os comandos abaixo na raiz do projeto ou dentro da pasta backend/src/main/resources

Gera a chave privada:

```bash
openssl genpkey -algorithm RSA -out app.key -pkeyopt rsa_keygen_bits:2048
```

Gera a chave pública a partir da privada:

```bash
openssl rsa -pubout -in app.key -out app.pub
```

Após gerar os arquivos app.key e app.pub, mova-os para:

backend/src/main/resources/

Sem essas chaves, o container do backend não irá iniciar corretamente.

---

---

## 🐳 Como subir os containers

### Pré-requisitos
- Docker
- Docker Compose

### Passos para execução

## COMANDOS PARA RODAR O PROJETO
```bash
# git clone <url-do-repositorio>
# cd gestor-de-vagas-fullstack
# docker-compose up --build
```

Aguarde a inicialização completa dos containers.

---

## 🌐 Como acessar o sistema

### Frontend
http://localhost:3000

### Backend (API)
http://localhost:8080

---

## 🔐 Credenciais de Teste

### 👤 Administrador
Usuário: admin  
Senha: admin123

Permissões:
- Criar, editar e excluir vagas
- Listar todas as candidaturas
- Aprovar ou reprovar candidatos
- Enviar feedback

### 👤 Usuário
Usuário: Gabriel  
Senha: 123

Obs: Você pode criar um **usuário novo** se preferir

Permissões:
- Visualizar vagas disponíveis
- Candidatar-se a vagas
- Cancelar a candidatura 
- Acompanhar status da candidatura
- Visualizar feedback

---

## 🔗 Endpoints Principais

### 🔑 Autenticação
POST /login

### 👤 Usuários
POST /users 
GET /users
GET /me

### 💼 Vagas
POST /vagas (ADMIN)  
GET /feed (BASIC)  
GET /vagas/{id} (ADMIN)  
PUT /vagas/{id} (ADMIN)  
DELETE /vagas/{id} (ADMIN)

### 📄 Candidaturas
POST /vagas/{id}/candidatar (BASIC)  
DELETE /vagas/{id}/candidatar (BASIC)
GET /candidaturas/minhas (BASIC)  
GET /vagas/{id}/candidaturas (ADMIN)  
PUT /candidaturas/{id}/status (ADMIN)  
PUT /candidaturas/{id}/feedback (ADMIN)
GET /candidaturas (ADMIN)




