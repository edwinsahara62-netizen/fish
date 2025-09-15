import { ref, readonly, onMounted, computed } from 'vue';

export const themes = {
  windy: {
    name: 'windy',
    layoutComponent: 'DefaultLayout',
    cssClass: null,
  },
  spiel: {
    name: 'spiel',
    layoutComponent: 'SpielHome',
    cssClass: 'dark',
  },
  mediumish: {
    name: 'mediumish',
    layoutComponent: 'MediumishHome',
    cssClass: 'mediumish-theme',
  },
};

const availableThemeNames = Object.keys(themes);
const currentThemeName = ref('windy');

const applyTheme = (themeName) => {
  if (!availableThemeNames.includes(themeName)) {
    themeName = 'windy';
  }
  
  currentThemeName.value = themeName;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = '';
    const themeClass = themes[themeName].cssClass;
    if (themeClass) {
      document.documentElement.classList.add(themeClass);
    }
  }
};

export function useTheme() {
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme && availableThemeNames.includes(savedTheme)) {
        applyTheme(savedTheme);
      } else if (userPrefersDark) {
        applyTheme('spiel');
      } else {
        applyTheme('windy');
      }
    }
  });

  const cycleTheme = () => {
    const currentIndex = availableThemeNames.indexOf(currentThemeName.value);
    const nextIndex = (currentIndex + 1) % availableThemeNames.length;
    applyTheme(availableThemeNames[nextIndex]);
  };

  return {
    currentThemeName: readonly(currentThemeName),
    cycleTheme,
  };
}