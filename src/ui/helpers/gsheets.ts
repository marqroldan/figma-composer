
import promiseObject from "./promise";

const urlbase = 'https://sheets.googleapis.com/v4/spreadsheets/';

export const extractSheetID = (gSheetsURL: string) => {
    return gSheetsURL.replace('https://docs.google.com/spreadsheets/d/', '').split('/')[0] || '';
}

export const obtainGsheetsData = (key: string, url: string) => {
    const sheetID = extractSheetID(url);

    const { requestPromise, rejectPromise, resolvePromise } = promiseObject();

    fetch(`${urlbase}${sheetID}?key=${key}`).then((res) => {
        if (res.ok) {
            res.json().then(resolvePromise).catch(rejectPromise);
        } else {
            rejectPromise();
        }
    }).catch(rejectPromise)

    return requestPromise;
}

export const obtainSheetRows = (key: string, url: string, sheetName: string, range?: string) => {
    const sheetID = extractSheetID(url);

    const { requestPromise, rejectPromise, resolvePromise } = promiseObject();

    fetch(`${urlbase}${sheetID}/values/${sheetName}${range ? '!' + range : ''}?key=${key}`).then((res) => {
        if (res.ok) {
            res.json().then(resolvePromise).catch(rejectPromise);
        } else {
            rejectPromise();
        }
    }).catch(rejectPromise)

    return requestPromise;
}