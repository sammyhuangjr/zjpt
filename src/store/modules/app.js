import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  routers:(localStorage.getItem('routers') !== null && localStorage.getItem('routers') !== 'undefined') ? JSON.parse(localStorage.getItem('routers')) : false,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_ROUTERS:(state,routers) =>{
    console.log('========>',routers)
    state.routers = routers;
    localStorage.setItem('routers',JSON.stringify(routers));
  },
  CLEAR_ROUTERS:(state) =>{
    state.routers = [];
    localStorage.removeItem('routers');
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setRouters({commit},routers){
    commit('SET_ROUTERS', routers)
  },
  clearRouters({commit}){
    commit('CLEAR_ROUTERS');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
