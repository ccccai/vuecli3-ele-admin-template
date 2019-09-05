import API from '@/assets/http/apiUrl'
import Request from '@/assets/http'

const user = {
  state: {
    token: '',
    name: ''
  },
  mutations: {
    SET_TOKEN: (state, data) => {
      state.token = data
      localStorage.setItem('ADMIN_TOKEN', data)
    },
    SET_NAME: (state, data) => {
      state.name = data
    }
  },
  actions: {
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        Request.httpRequest({
          method: 'post',
          url: API.Login,
          params: params,
          success: data => {
            console.log(111)
            commit('SET_TOKEN', data.token)
            resolve(data)
          },
          error: err => {
            reject(err)
          }
        })
      })
    },

    LoginByVin({ dispatch, commit }, params) {
      return dispatch('Login', params)
    },

    ResetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        localStorage.removeItem('ADMIN_TOKEN')
        resolve()
      })
    },

    // ??
    LogOut({ dispatch, commit }) {
      return dispatch('ResetToken')
    }
  }
}

export default user

