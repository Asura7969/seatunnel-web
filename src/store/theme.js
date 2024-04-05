import {defineStore} from 'pinia'

export const useThemeStore = defineStore('theme', {
    actions: {
      update(value) {
        this.golabTheme = value;
      }
    },
    state() {
      return {
        golabTheme: "light",
      }
    },
    getters: {
      isDarkTheme() {
        return this.golabTheme === "dark";
      },
    }
  })