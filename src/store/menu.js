import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    actions: {
      update(value) {
        // this是当前的store
        this.loginUser = value;
      }
    },
    state() {
      return {
        loginUser: {
          name: '',
          email: '',
        }
      }
    },
    getters: {
      name(state) {
        return state.loginUser.name;
      }
    }
  })