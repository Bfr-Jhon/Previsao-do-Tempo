# 🌤️ Aplicativo de Previsão do Tempo

Aplicação web simples que consome a API Open-Meteo para exibir a temperatura atual de uma cidade informada pelo usuário.

---

## 🚀 Funcionalidades

- Buscar temperatura por nome da cidade
- Validação de entrada
- Tratamento de erros
- Integração com API externa
- Testes automatizados com Jest

---

## 🛠️ Tecnologias

- JavaScript (puro)
- HTML5
- CSS3
- Jest (testes)

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
git clone https://github.com/Bfr-Jhon/Previsao-do-Tempo.git


2. Acesse a pasta:
cd Previsao-do-Tempo


3. Abra o `index.html` no navegador

---

## 🧪 Como rodar os testes
npm install
npm test


---

## ✅ Cenários testados

- Cidade válida retorna temperatura
- Cidade inexistente retorna erro
- Entrada vazia retorna erro
- Falha na API tratada corretamente

---

## ⚠️ Observações

- Os testes utilizam **mock do fetch**, evitando chamadas reais à API.
- O código foi estruturado para funcionar tanto no navegador quanto no ambiente de testes (Node.js).

---

## 📌 Autor

Jhonatha Oliveira