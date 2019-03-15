export default {
    state: {
        selectedAppId: 0,
        selectedApp: {}
    },
    mutations: {
        setSelectedAppId(state, appId) {
            state.selectedAppId = appId
        },
        setSelectedApp(state, app) {
            state.selectedApp = app
        }
    },
    actions: {}
}
