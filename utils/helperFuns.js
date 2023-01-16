
import { Table } from 'console-table-printer';
import cliHtml from 'cli-html';
import boxen from 'boxen';

const validateResp = (output) => {
    let respStatusText = output.statusText || output.response.statusText
    if (respStatusText !== "OK") {
        throw new Error(respStatusText);
    }
}

const getDisplayName = (name) => {
    let afterLastSlash = name.substring(name.lastIndexOf('\\') + 1);
    return afterLastSlash
}

const createConsoleTable = (epicBody, epicTeam, featureTeams, iteration) => {
    const p = new Table({
        title: "Epic Details",
        alignment: "left",
        columns: [
            { name: "head", alignment: "left", },
            { name: "value", alignment: "left" }
        ],
    });

    p.addRows([
        { head: "Title", value: epicBody[0].value },
        // { head: "Description", value: cliHtml(epicBody[1].value) },
        { head: "Epic Team", value: getDisplayName(epicTeam['value']) },
        { head: "Feature Team", value: featureTeams['value'].map(team => getDisplayName(team)).join(', ') },
        { head: "PI", value: getDisplayName(iteration['value']) },
    ]);

    console.log('\n')
    p.printTable()
    console.log(boxen(cliHtml(epicBody[1].value), { title: 'Description', padding: 0.5 }));
}


// get item id by url string
let getItemIdByURL = (url = '') => {
    let strAry = url.split('/')
    return strAry.slice(strAry.length - 1, strAry.length)?.[0] || undefined
}

export { validateResp, getDisplayName, createConsoleTable, getItemIdByURL }