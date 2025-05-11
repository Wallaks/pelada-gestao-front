# pelada-gestao-front

Gestão da pelada - frontend

## Características

- Cadastro de jogadores (com opção de goleiro)
- Criação e configuração de sorteios de times
- Sorteio automático de equipes e reservas
- Visualização de sorteios em andamento e anteriores
- Exclusão de jogadores e sorteios
- Interface simples e responsiva
- Feedback visual com toast e loading

## Tecnologias Utilizadas

- HTML5
- JavaScript
- Fetch API para comunicação com backend REST
- Estrutura modular de arquivos (separação por páginas e funções)
- [pelada-gestao](https://github.com/Wallaks/pelada-gestao) como backend (API)

## Estrutura de Pastas

```
index.html
css/
  style.css
  toast.css
js/
  cadastro.js
  configuracao.js
  script.js
  sorteios-anteriores.js
  utils.js
pages/
  cadastro.html
  configuracao.html
  sorteios-anteriores.html
```

## Como rodar

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador
3. Certifique-se de que o backend está rodando em `localhost:8080` ou utilize a versão em produção