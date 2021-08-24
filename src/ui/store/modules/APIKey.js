export default {
    state: {
        value: ''
    },
    mutations: {
        changeKey(state, APIKey) {
            state.value = APIKey
        }
    },
}