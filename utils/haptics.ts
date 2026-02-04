
/**
 * Nkelo Haptic Engine v1.0
 * Protocolos de vibração para simulação somatossensorial.
 */
export const Haptics = {
  // Feedback leve para cliques de navegação
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Feedback médio para interações de interface
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  
  // Padrão de sucesso: Curto-Longo
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10, 50]);
    }
  },
  
  // Padrão de erro: Sequência de interrupção
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50, 50, 50]);
    }
  },
  
  // Padrão de Recompensa: Pulso rítmico
  reward: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 30, 100, 30, 200]);
    }
  }
};
