import { setAppId, getAppId } from '@/libs/util'

export default {
  state: {
    selectedAppId: getAppId(),
    selectedApp: {}
  },
  getters: {
    getSelectedAppId: state => {
      console.log('state: ' + state.selectedAppId)
      return state.selectedAppId
    }
  },
  mutations: {
    setSelectedAppId (state, appId) {
      state.selectedAppId = appId
      setAppId(appId)
    },
    setSelectedApp (state, app) {
      state.selectedApp = app
    }
  },
  actions: {}
}
