# pelada-gestao-front

Frontend do sistema de gestão de pelada.

## Características

- Cadastro de pessoas (admin ou organizador)
- Criação e configuração de sorteios de times
- Cadastro de jogadores (com opção de goleiro)
- Sorteio automático de equipes e reservas
- Exclusão de jogadores e sorteios
- Visualização de sorteios anteriores
- Interface simples e responsiva
- Feedback visual com toast e loading

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript puro (Vanilla JS)
- Fetch API para integração com backend REST
- Organização modular por páginas e funções
- Backend: [pelada-gestao](https://github.com/Wallaks/pelada-gestao)

## Estrutura de Pastas

```
css/
  style.css
  toast.css

js/
  cadastroJogador.js
  cadastroPessoa.js
  cadastroSorteio.js
  home.js
  index.js
  sorteiosAnteriores.js
  utils.js

pages/
  cadastroJogador.html
  cadastroPessoa.html
  cadastroSorteio.html
  home.html
  sorteiosAnteriores.html

index.html
README.md
```

## Como rodar

1. Clone este repositório:
   ```bash
   git clone https://github.com/Wallaks/pelada-gestao-front.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd pelada-gestao-front
   ```

3. Abra o arquivo `index.html` ou `pages/home.html` no navegador.

4. Certifique-se de que o backend está rodando em `http://localhost:8080` ou utilize a URL da versão em produção.
