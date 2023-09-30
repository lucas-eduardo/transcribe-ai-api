# Transcribe AI
<p align="center">
  <img src="./.github/lucas_eduardo.png" width="200" style="border-radius:100%">
</p>

## Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Instalação](#instalação)
6. [Execução](#execução)
7. [Testes unitários](#testes-unitários)
8. [Executando Testes E2E](#executando-testes-e2e)

## Visão Geral
O **Transcribe AI** é uma aplicação projetada para simplificar o processo de transcrição de áudios, fornecendo recursos de geração de legendas (SRT) e transcrições de maneira eficiente e automatizada.

Com a capacidade de interação direta com o ChatGPT, o **Transcribe AI** eleva a geração de conteúdo relacionado a um novo patamar, possibilitando uma abordagem inteligente e aprimorada.

Aprimore a produtividade e agilize suas tarefas de transcrição com essa ferramenta poderosa. Transcrições precisas e automatizadas estão ao seu alcance com o **Transcribe AI**.

## Estrutura de Pastas
O projeto está organizado em uma estrutura de pastas que segue boas práticas de arquitetura de software. Algumas pastas principais incluem:

- `src/core`: Contém elementos essenciais para a aplicação, como entidades, tipos e erros.

- `src/domain`: Agrupa módulos de domínio, como audio e prompt.

- `src/infra`: Engloba a infraestrutura, como camadas de banco de dados, HTTP e armazenamento.

- `src/infra/http/controllers`: Controladores HTTP para manipulação de recursos específicos.

**A seguir estão algumas pastas principais da camada de domain:**
- `__tests__`: Contém testes unitários e testes.

- `application`: Implementa a lógica de aplicação.

- `enterprise`: Define entidades de domínio.

**A seguir estão algumas pastas principais da camada de infra:**
- `env`: Validador das variaveis de ambiente.

- `database/prisma`: Fornece acesso ao banco de dados utilizando o Prisma

- `http/controllers`: Controladores específicos para cada recurso da sua aplicação.

- `presenters`: Responsavel por apresentar os dados ao mundo exterior.

## Instalação
Siga os passos abaixo para instalar as dependências do projeto:

```bash
# Clone o repositório
git clone https://github.com/lucas-eduardo/transcribe-ai-api.git

# Acesse o diretório do projeto
cd transcribe-ai

# Instale as dependências
yarn install
```

## Execução
Para executar a aplicação, siga os passos abaixo:

```bash
yarn start:dev
```

A aplicação estará disponível em http://localhost:3333.

## Testes unitários
Execute os testes unitários com o seguinte comando:

```bash
yarn test
```

## Executando Testes E2E
Para executar os testes end-to-end (E2E), siga os passos abaixo:

1. Certifique-se de que o Docker está em execução no seu ambiente.

2. Execute o comando `docker compose up` para iniciar os serviços necessários.

3. Execute o comando `yarn test:e2e` para executar os testes E2E.

[Repositório do Frontend](https://github.com/lucas-eduardo/transcribe-ai-web)