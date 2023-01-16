# Description
A Nodejs script to add new Epic and Linked features with selected teams and iteration through CLI. 

## Steps to run
- Run ```yarn install``` in root folder to download npm modules
- Create a token with from `Users-Settings`
- Update Azure DevOps `API_USERNAME`, `API_TOKEN`, `API_ORGANISATION` and `API_PROJECT` details in ```.env``` file in root folder
- Update Epic or Feature name,description etc. at path ```config/taskConfig.js``` 
- Run ```yarn start``` to start the script
- Search and Select team for the epic and press enter
- Search and Select multiple teams to add feature by clicking spacebar and finally clicking enter to choose teams
- Search and Select iteration for the epic and features and press enter
- It will create epics and linked features and provide browser links for the items. 

### Add description using editor
- Open [Html Editor](https://onlinehtmleditor.dev/)
- Create description and copy html source code
- Paste html code in ```config/taskConfig.js``` below ```{"path": "/fields/System.Description"},```