export const generateHTML = (epicRelations)=>{
    try {
        // array to hold HTML tags
        let markupArray = "<ul>";
      
        // evaluate expressions
        const createList = (items) => {
          switch (typeof items) {
            case "object":
              getItems(items);
              break;
          }
        };
      
        // get items in the object
        const getItems = (items) => {
          for (const item in items) {
      
            // fetch the parent object
            let details = items[item];
            // console.log({details:details.relation});
            markupArray += (`<li> <div class="${details.relation?.toLowerCase()} tooltip">  <span class="tooltiptext">{details.description}</span>`);
            getDetails(details);
            // push the closing tag for parent
            markupArray += ("</li>");
          }
        };
      
        // get details
        const getDetails = (details) => {
          // iterate over the detail items of object
      
          for (const detail in details) {
            // fetch the value of each item
            if (detail == "relations" && details[detail].length) {
              markupArray += ("</div><ul>");
              details[detail].forEach((element) => {
                getItems(element);
              });
              markupArray += ("</ul>");
            } else {
                if(detail === 'description') return
              if(detail === 'state'){
                markupArray += (`<span> Status: ${details[detail]} </span>`);
              }
             else{
              markupArray += (`<span> ${details[detail]} </span>`);
             }
            }
          }
        };
      
        createList(epicRelations);
        markupArray += ("</ul>");
      
        fs.writeFile('index.html',
          `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EPIC | TREE</title>
          <link rel="stylesheet" href="./main.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      </head>
      <body>
      <h1 style='text-align: center;
      text-decoration: underline' >Tree visualiser for item id ${ITEM_ID}</h1>
          <div id="list">
          ${markupArray}
          </div>
      </body>
      </html>
         `, (err, data) => {
          if (err) {
            console.log((error));
          } else {
            // console.log({data});
          }
        })
      
      }
      catch (error) {
        console.log({ error });
      }
}