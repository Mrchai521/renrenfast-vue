import Vue from 'vue';
import Vuex from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import common from './modules/common';
import user from './modules/user';

// import app from './modules/app';
// import tagsView from './modules/tagsView';
// import permission from './modules/permission';
// import settings from './modules/settings';
// import getters from './getters';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    common,
    user,
    // tagsView,
    // permission,
    // settings,
    // app,
  },
 // getters,
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key]);
      });
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
export default store;
