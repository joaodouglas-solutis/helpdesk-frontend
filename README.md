# Helpdesk Frontend

Interface web do sistema Helpdesk desenvolvida em React.

## Arquitetura

A aplicação está organizada principalmente em:

```text
src/
├── components/
├── pages/
├── services/
├── assets/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

A estrutura separa componentes reutilizáveis, páginas de navegação e serviços responsáveis pela comunicação com o backend.

## App

`App.jsx` funciona como composição principal da aplicação.

Ele mantém:

```text
token
user
```

no estado global da aplicação.

O usuário autenticado é reconstruído através de:

```java
getAuthenticatedUser()
```

e o token através de:

```java
getToken()
```

## Rotas

As rotas são definidas através do React Router.

A área autenticada é encapsulada por `ProtectedLayout`, que concentra:

```text
Sidebar
Header
Routes
```

As páginas principais incluem:

```text
/dashboard
/tickets
/tickets/:id
/notifications
/users
```

As rotas públicas incluem:

```text
/login
/register
```

Usuários não autenticados são redirecionados para `/login`.

## Controle de acesso na interface

A rota `/users` possui uma proteção específica:

```text
user?.role === 'ADMIN'
```

Administradores acessam a página de gerenciamento de usuários.

Outros perfis são redirecionados para o dashboard.

O mesmo conceito é utilizado pelos componentes para exibir funcionalidades de acordo com o papel do usuário.

## Comunicação com a API

`services/api.js` centraliza as requisições HTTP.

A função:

```text
apiFetch()
```

é responsável por:

* montar a URL do Gateway;
* configurar `Content-Type`;
* recuperar o token;
* adicionar o header `Authorization`.

O token é enviado como:

```text
Authorization: Bearer <token>
```

Isso evita repetir a lógica de autenticação em cada serviço específico.

## Autenticação no frontend

`services/auth.js` concentra o gerenciamento do token.

O token é armazenado em:

```text
localStorage
```

utilizando a chave:

```text
helpdesk_token
```

As operações disponíveis são:

```text
getToken()
setToken()
removeToken()
```

## Leitura do JWT

O frontend não precisa fazer uma nova chamada ao backend apenas para descobrir os dados básicos do usuário autenticado.

`getAuthenticatedUser()` decodifica o payload do JWT e extrai:

```text
sub
name
email
role
```

O objeto retornado é utilizado pela aplicação para montar a interface autenticada.

## Fluxo de autenticação

O fluxo principal do frontend é:

```text
Login
 ↓
Token recebido
 ↓
setToken()
 ↓
App atualiza estado
 ↓
getAuthenticatedUser()
 ↓
ProtectedLayout
 ↓
Dashboard / Tickets / Notifications / Users
```

No logout:

```text
removeToken()
 ↓
token = null
 ↓
user = null
 ↓
redirecionamento para Login
```

## Componentização

Componentes recorrentes ficam separados em `components`.

Entre eles:

```text
Sidebar
Header
StatCard
TicketRow
NewTicketModal
ChangePasswordModal
```

As páginas permanecem em `pages`, mantendo componentes de interface reutilizáveis separados das telas de navegação.

## Estilização

A aplicação mantém arquivos CSS próximos aos componentes e páginas correspondentes.

Existem estilos específicos para:

```text
Login
Register
Dashboard
Tickets
TicketDetails
Notifications
Users
NewTicketModal
ChangePasswordModal
```

Além dos estilos globais em:

```text
App.css
index.css
```

## Containerização

O frontend possui:

```text
Dockerfile
nginx.conf
.dockerignore
```

A presença do `nginx.conf` separa a execução da aplicação construída do servidor responsável pela entrega dos arquivos estáticos.
