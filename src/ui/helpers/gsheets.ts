export const obtainGsheetsData = () => {
    const key = 'AIzaSyD3xEOcE-O_C_d2EsREcYICFURVGo-itdY';
    const sheetID = '17YXfsS3mB5p174hZmfh_bnzONsdxV_nN13q0qgTDtMg';
    const urlbase = 'https://sheets.googleapis.com/v4/spreadsheets/';

    console.log("HELLO", window.location.hostname)

    fetch(`${urlbase}${sheetID}?key=${key}`).then((res) => {
        if (res.ok) {
            return res.json();
        }
    }).catch((e) => {
        console.warn(e)
    }).then((res) => {

        console.log("Yay", res);
    });
}