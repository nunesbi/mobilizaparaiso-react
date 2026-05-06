/**
 * APP_CONFIG
 * Centraliza todos os valores fixos e regras de negócio do aplicativo.
 * Alterar esses valores afeta o comportamento global do rastreamento e da interface.
 */
export const APP_CONFIG = {
  // Valores exibidos na interface sobre a passagem
  TARIFA_VALOR: 3.45,
  TARIFA_TEXTO: 'R$ 3,45',

  /**
   * Tempo de espera entre chamadas à API de Direções do Google (ETA).
   * Definido em milissegundos. 30000ms = 30 segundos.
   * Aumentar este valor economiza dinheiro, mas deixa o ETA mais "lento" para atualizar.
   */
  API_THROTTLE_MS: 30000, 

  /**
   * Raio de detecção (em metros) para as paradas de ônibus.
   * Quando o ônibus estiver a menos desta distância de um ponto, o sistema
   * entende que ele "chegou" e passa a calcular o tempo para o próximo ponto.
   */
  DISTANCIA_PROXIMIDADE_PONTO: 60, 

  /**
   * Distância de segurança (em metros) para reiniciar o simulador.
   * Usado apenas no modo MOCK. Quando o ônibus chega ao fim da linha e "teletransporta"
   * para o início, se ele estiver a menos de 350m do primeiro ponto, o sistema reseta o índice.
   */
  DISTANCIA_REINICIO_ROTA: 350,   

  /**
   * Coordenadas padrão para centralizar o mapa caso a posição do ônibus 
   * ainda não tenha sido carregada. (Centro de São Sebastião do Paraíso)
   */
  DEFAULT_CENTER: {
    lat: -20.899853,
    lng: -46.987238
  },

  // Configurações do ThingsBoard
  THINGSBOARD: {
    HOST: 'https://demo.thingsboard.io', // Ou o IP do seu servidor
    DEVICE_ID: 'SEU_DEVICE_ID_AQUI',
    ACCESS_TOKEN: 'SEU_ACCESS_TOKEN_AQUI',
    POLLING_INTERVAL_MS: 5000 // Frequência de atualização (5 segundos)
  }
};
