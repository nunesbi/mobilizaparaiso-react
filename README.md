# 🚌 Mobiliza Paraíso

Sistema web para visualização da localização de ônibus em tempo real, com mapa integrado e simulação de movimento.

---

## 📌 Sobre o projeto

O **Mobiliza Paraíso** é uma aplicação desenvolvida em **React**, que simula o rastreamento de ônibus, permitindo que o usuário visualize:

* Localização do ônibus em tempo real
* Mapa integrado via dashboard (ThingsBoard)
* Tempo estimado e atualização dinâmica
* Interface moderna semelhante a um aplicativo mobile

---

## 🚀 Tecnologias utilizadas

* React (Vite)
* CSS
* JavaScript
* Node.js (backend de simulação)
* ThingsBoard (mapa e dashboard em tempo real)

---

## ▶️ Como executar o projeto

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/nunesbi/mobilizaparaiso-react.git
cd mobilizaparaiso-react
```

---

### 🔹 2. Instalar dependências

```bash
npm install
```

---

### 🔹 3. Rodar o frontend (React)

```bash
npm run dev
```

O projeto estará disponível em:

```
http://localhost:5173
```

---

### 🔹 4. Rodar o backend (simulação)

```bash
node server.cjs
```

O backend ficará disponível em:

```
http://localhost:3000/location
```

---

### 🔹 5. Utilizar o sistema

* Clique no botão inicial
* Visualize o mapa integrado (ThingsBoard)
* Acompanhe o status do ônibus
* Veja o tempo de atualização em tempo real
* Expanda a lista de próximos pontos

---

## 🧠 Funcionalidades

* Interface responsiva estilo aplicativo
* Tela inicial interativa
* Integração com ThingsBoard (mapa em tempo real)
* Simulação de localização via backend
* Atualização automática do horário
* Lista de próximos pontos

---

## 🔮 Possíveis melhorias

* Integração com APIs reais de transporte
* Múltiplos ônibus simultâneos
* Atualização em tempo real via WebSocket
* Sistema de notificações
* Versão mobile (React Native)

---
