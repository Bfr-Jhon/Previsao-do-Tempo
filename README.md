# 🌤️ Aplicativo de Previsão do Tempo

Aplicação web simples que consome a API Open-Meteo para exibir dados meteorológicos de uma cidade informada pelo usuário.

---

## 🚀 Funcionalidades

- 🔍 Busca de clima por nome da cidade  
- 🌡️ Exibição da temperatura atual  
- ⚠️ Validação de entrada do usuário  
- 🛡️ Tratamento de erros (cidade inválida ou falha na API)  
- 🔗 Integração com API externa (Open-Meteo)  
- 🧪 Testes automatizados com Jest  

---

## 🛠️ Tecnologias

- JavaScript (Vanilla)
- HTML5
- CSS3
- Jest (testes automatizados)

---

## 📁 Estrutura do Projeto
projeto_clima/
│
├── index.html
├── assets/
│ ├── script/
│ │ └── api.js
│ └── style/
│ └── style.css
│
├── tests/
│ └── api.test.js
│
└── package.json


---

## ▶️ Como executar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/Bfr-Jhon/Previsao-do-Tempo.git

Acesse a pasta:
cd Previsao-do-Tempo
Abra o arquivo index.html no navegador


🧪 Como rodar os testes
Instale as dependências: npm install
Execute os testes: npm test


✅ Cenários testados

✔️ Cidade válida retorna temperatura
✔️ Cidade inexistente retorna erro
✔️ Entrada vazia retorna erro
✔️ Falha na API tratada corretamente


🔒 Segurança e Boas Práticas

Nenhuma chave de API é exposta (Open-Meteo não requer autenticação)
Uso de try/catch para tratamento de erros
Validação de entrada do usuário
Uso de mocks nos testes para evitar dependência externa


⚠️ Observações
Os testes utilizam mock do fetch, evitando chamadas reais à API
O código foi estruturado para funcionar tanto no navegador quanto no ambiente de testes (Node.js)


📌 Autor
Jhonatha Oliveira

📄 Licença
Este projeto está sob a licença MIT.