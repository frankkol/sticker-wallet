# ⚽Front-End React + TypeScript + Tailwind (WCF2026)
[![github](https://img.shields.io/badge/github-%40frankkol-grey?style=for-the-badge&logo=github)](https://github.com/frankkol)
[![linkedin](https://img.shields.io/badge/linkedin-%40frankkol-blue?style=for-the-badge)](https://linkedin.com/in/frankkol)

## 💡Motivação do projeto.

Com o hype recente das coleções de figurinhas da copa do mundo, comecei a notar muitas pessoas utilizando planilhas online para controlar suas carteiras e descobrir quais itens faltavam e quais tinham extra.

## Este front-end tem como objetivo permitir ao usuário o gerenciamento da sua carteira de figurinhas da copa do mundo 2026.

- Visualizar dados da carteira (total, completas, faltantes e extras);
- Visualizar valor de investimento da carteira;
- Visão global do progresso da sua coleção (por página, país ou geral);
- Busca (por código, jogador ou país);

## 🚀 Próximos passos do projeto

- Criar uma funcionalidade para importar carteira de amigos e realizar comparações automáticas;
- Sugerir trocas benéficas para ambos os lados;
- Transformar algo manual em uma experiência prática e inteligente;

## Tecnologias
 - [React](https://react.dev/)
 - [TypeScript](https://www.typescriptlang.org/)
 - [Tailwind](https://tailwindcss.com/)

## 📸 Telas do sistema
![Tela inicial WCF 2026](./public/print/home.png)![Exportar carteira](./public/print/export.png)
![Importar carteira](./public/print/import.png)![Dados](./public/print/dashboard.png)
![Seleção Mexico](./public/print/not_complete.png)![Seleção Brasil](./public/print/complete.png)
![Busca por código](./public/print/search.png)

## 🌐 API

#### Extrutura do arquivo (JSON) criado e gerenciado pela aplicação, permitindo exportar e importar a qualquer momento.

```http
  EXPORT
```
```json
  {
    "worldCup": "2026",
    "createdAt": "2026-05-25T13:19:54.929Z",
    "countries": [
      {
        "flag": "🇲🇽",
        "name": "Mexico",
        "id": "MEX",
        "color": "#1d724c",
        "stickers": [
          {
            "code": "MEX1",
            "type": "team",
            "name": "Escudo",
            "hasSticker": true,
            "positiveQty": 0,
            "negativeQty": 0,
            "page": 8
          },
          {
            "code": "MEX2",
            "type": "player",
            "name": "",
            "hasSticker": false,
            "positiveQty": 0,
            "negativeQty": -1,
            "page": 8
          }
    ]
  }
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `code`     | `String` | Identificador único da figura. |           |
| `type`  | `String`| { team , player , squad } identifica o tipo da figura. |
| `name`  | `String`| **Opcional**. Destinado ao nome do jogador. |
| `hasSticker`  | `Boolean`| Controle para validação se possui a figura. |
| `positiveQty`  | `Integer`| Controle para figuras extras. |
| `page`  | `Integer`| Identificador da página onde a figura se encontra. |
