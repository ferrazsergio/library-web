# 📚 library-web

Frontend React do **Sistema de Gerenciamento de Biblioteca** — uma aplicação moderna e responsiva para controle de livros, leitores, empréstimos e muito mais!

![Dashboard Screenshot](./public/screenshots/dashboard.png)

## ✨ Principais Funcionalidades

- Autenticação segura (JWT) e controle de permissões (admin, bibliotecário, leitor)
- Cadastro, edição e busca de livros, autores e usuários
- Gestão completa de empréstimos, devoluções e multas
- Dashboard com gráficos e indicadores em tempo real
- Upload e recorte de foto de perfil do usuário
- Acessibilidade: ajuste de contraste, tamanho de fonte e navegação por teclado
- Interface responsiva (desktop/mobile)
- Experiência fluida com animações e feedback visual

## 🛠️ Stack Tecnológica

- **React 18 + TypeScript**
- **Material UI** (MUI)
- **React Router Dom** (SPA)
- **Axios** (integração com API REST)
- **Framer Motion** (animações)
- **Validação de formulários** com feedback instantâneo

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18+)
- npm ou yarn
- Uma instância da [library-api](https://github.com/ferrazsergio/library-api) rodando (veja o README da API!)

### Instalação

```bash
git clone https://github.com/ferrazsergio/library-web.git
cd library-web
npm install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto com:

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```
Ajuste a URL conforme o endereço onde sua API está rodando.

### Rodando em modo desenvolvimento

```bash
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build para produção

```bash
npm run build
```

Os arquivos finais estarão na pasta `build/`.

## 🔗 API Back-end

Este front depende da [library-api](https://github.com/ferrazsergio/library-api).  
Confira o repositório para instruções de deploy e endpoints disponíveis.

## 🖼️ Telas e Features Sugeridas para Prints

- Dashboard com gráficos e atividades recentes
- Tela de login
- Listagem e cadastro de livros
- Tela de perfil do usuário (com upload de foto)
- Gestão de empréstimos
- Responsividade no mobile

## 📝 Scripts Disponíveis

- `npm start` — roda em modo desenvolvimento
- `npm test` — executa testes interativos
- `npm run build` — gera build de produção
- `npm run eject` — **(irreversível)** expõe configs internas do CRA

## 🤝 Contribuições

Pull Requests são bem-vindos! Sinta-se à vontade para abrir issues ou sugerir melhorias.

## 📄 Licença

MIT

---

Desenvolvido por [@ferrazsergio](https://github.com/ferrazsergio) — inspire, compartilhe e construa! 🚀
