import { obtainGsheetsData } from "../../helpers/gsheets";

export default {
    state: {
        value: '',
        sheetName: '',
        sheets: [],
    },
    mutations: {
        updateGSheetsData(state, data) {
            state.sheetName = data.properties.title;
            state.sheets = data.sheets.map((item) => item.title);
        },
        changeKey(state, APIKey) {
            state.value = APIKey
        }
    },
    actions: {
        async fetchGSheetsData({ commit, rootState }, payload) {
            obtainGsheetsData(rootState.APIKey.value, payload.url).then((value) => {
                commit('updateGSheetsData', value);
                payload.success?.();
            }).catch((e) => {
                payload?.error?.()
            })
        }
    }
}