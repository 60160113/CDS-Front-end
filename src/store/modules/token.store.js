import AuthService from "../../services/modules/auth.service.js";
const auth_service = new AuthService();

const state = {
  token: localStorage.getItem("user-token") | "",
  status: ""
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  setTokenUser: async (state, user) => {
    state.commit("AUTH_REQUEST");
    await auth_service
      .login(user)
      .then(res => state.commit("AUTH_SUCCESS", res.token))
      .catch(() => state.commit("AUTH_ERROR"));
  },
  logoutUser: state => {
    state.commit("AUTH_LOGOUT");
  }
};

const mutations = {
  AUTH_REQUEST: state => {
    state.status = "loading";
  },
  AUTH_SUCCESS: (state, token) => {
    state.status = "success";
    state.token = token;
    localStorage.setItem("user-token", state.token);
  },
  AUTH_ERROR: state => {
    state.status = "error";
  },
  AUTH_LOGOUT: state => {
    state.status = "";
    state.token = "";
    localStorage.removeItem("user-token");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
