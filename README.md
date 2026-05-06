# 🚌 Mobiliza Paraíso

Sistema web e aplicativo mobile (Android/iOS) para visualização da localização de ônibus em tempo real, com mapa integrado via Google Maps API, cálculo de rotas (ETA) e interface moderna projetada para uso móvel.

---

## 📌 Sobre o projeto

O **Mobiliza Paraíso** foi projetado para oferecer aos cidadãos de São Sebastião do Paraíso uma plataforma fácil e rápida para acompanhar as rotas de transporte público. O projeto começou como uma interface web (React) e foi empacotado para distribuição nativa através do **Capacitor**, entregando uma experiência de aplicativo fluido, com tela de carregamento animada e acesso direto ao GPS nativo.

## 🧠 Principais Funcionalidades

* 📱 **Interface Mobile-First:** Design limpo, sem firulas de hover em botões, e animações nativas para uma experiência imersiva.
* 🗺️ **Integração Google Maps API:** Renderização customizada de mapas sem botões inúteis da interface padrão do Google.
* 📍 **Geolocalização do Usuário:** Utiliza o GPS do celular para exibir onde o usuário está em relação ao ônibus.
* ⏱️ **Cálculo de ETA Real:** Utiliza a Directions API do Google para calcular o tempo estimado de chegada (com mecanismo de _throttling_ para otimização de custos).
* 🔄 **Modos de Operação:** Suporta tanto simulação de rotas offline quanto integração real (ThingsBoard via API).
* ☕ **Custom Splash Screen:** Tela de carregamento customizada e baseada no logotipo oficial durante inicializações frias.

---

## 🚀 Tecnologias utilizadas

* **Frontend:** React + Vite
* **Estilização:** CSS Vanilla (Focado em performance e custom properties)
* **Mapas & Roteamento:** `@react-google-maps/api`
* **Mobile (Híbrido):** Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`)

---

## ⚙️ Pré-requisitos e Variáveis de Ambiente

Antes de começar, crie um arquivo `.env` na raiz do projeto com a chave do Google Maps:

```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

Para rodar os apps nativos você precisará de:
- **Android:** Android Studio instalado.
- **iOS:** Computador rodando macOS e o Xcode instalado.

---

## ▶️ Como executar o projeto (Web)

### 1. Clonar o repositório

```bash
git clone https://github.com/nunesbi/mobilizaparaiso-react.git
cd mobilizaparaiso-react
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`. O acesso ao GPS no navegador pode exigir que você acesse via `localhost` ou `https`.

---

## 📱 Como empacotar e executar no Mobile (Capacitor)

O projeto está configurado para exportar o código React para aplicativos nativos Android e iOS.

### 1. Gerar o build de Produção

Primeiro, você precisa compilar o código React para HTML/CSS/JS estáticos (pasta `dist`):

```bash
npm run build
```

### 2. Sincronizar com os projetos Nativos

Sempre que fizer alterações no código React, após rodar o build, sincronize os arquivos com as pastas nativas (`android/` e `ios/`):

```bash
npx cap sync
```

### 3. Abrir e compilar no Android Studio ou Xcode

Para rodar no emulador ou compilar o `.apk` / `.aab` / `.ipa`:

**Para Android:**
```bash
npx cap open android
```
*Isso abrirá o projeto no Android Studio. Certifique-se de que o SDK do Android está configurado. O aplicativo solicitará permissões de `ACCESS_COARSE_LOCATION` e `ACCESS_FINE_LOCATION`.*

**Para iOS (Somente macOS):**
```bash
npx cap open ios
```
*Isso abrirá o projeto no Xcode. O aplicativo utilizará as chaves `NSLocationWhenInUseUsageDescription` do arquivo `Info.plist`.*

---

## 📁 Estrutura do Projeto

* `src/screens/` - Componentes principais que funcionam como telas independentes (Splash, Mapa, Seleção).
* `src/hooks/` - Lógica isolada, como o `useTracking.js` que gerencia a comunicação com ThingsBoard e o loop de simulação.
* `src/config/` - Arquivos de configuração global, limites de chamadas de API (`constants.js`).
* `android/` e `ios/` - Pastas gerenciadas pelo Capacitor contendo a infraestrutura nativa do aplicativo.

---
