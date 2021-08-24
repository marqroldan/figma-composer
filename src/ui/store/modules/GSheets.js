import { obtainGsheetsData, obtainSheetRows } from "../../helpers/gsheets";

export default {
    state: {
        url: '',
        value: '',
        sheetName: '',
        sheets: [],
        sheetData: {},
        headers: {},
    },
    mutations: {
        updateGSheetsData(state, data) {
            state.sheetName = data.properties.title;
            state.sheets = data.sheets.map((item) => item.properties.title);
        },
        updateSheetRows(state, data) {
            state.headers = {
                ...state.headers,
                [data.sheetName]: data.values[0]
            };
            data.values.shift();
            state.sheetData = {
                ...state.sheetData,
                [data.sheetName]: data.values
            }
        },
        changeKey(state, APIKey) {
            state.value = APIKey
        },
        changeSheetsURL(state, url) {
            state.url = url;
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
        },
        async fetchSheetRows({ commit, state, rootState }, payload) {
            obtainSheetRows(rootState.APIKey.value, state.url, payload.sheetName, payload.range).then((value) => {
                commit('updateSheetRows', {
                    values: value.values,
                    sheetName: payload.sheetName,
                });
                payload.success?.();
            }).catch((e) => {
                payload?.error?.()
            })
        }
    }
}