import * as dotenv from 'dotenv'
dotenv.config()

const {API_USERNAME,API_TOKEN,API_ORGANISATION,API_PROJECT}=process.env

const azureConfig={
    authHeader:`Basic ${Buffer.from(`${API_USERNAME}:${API_TOKEN}`).toString('base64')}`,
    apiUrl:`https://dev.azure.com/${API_ORGANISATION}/${API_PROJECT}/_apis/wit`,
}


//https://dev.azure.com/vinaxikhalasi/Epics%20and%20Feature%20visualiser/_workitems/recentlyupdated/

export default azureConfig
