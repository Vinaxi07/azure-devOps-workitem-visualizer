import fs from 'fs'
import { fetchRelations, fetchWorkItem } from './services/index.js';
import { getItemIdByURL } from './utils/helperFuns.js';

const ITEM_ID = '11'
const traversedItems = []

// --------------------get all relations by item id------------------
const getAllRelationsById = async (itemId) => {
  // console.log({itemId});
  try {
    if (traversedItems.includes(itemId)) return
    traversedItems.push(itemId)
    let workItemTree = {}, relations = []
    let workItemData = await fetchWorkItem(itemId)

   // console.log({workItemData:workItemData?.data});

    try {
      // console.log({ itemId, traversedItems });
      let workItemRelations = await fetchRelations([itemId])
      let relationValue = workItemRelations?.data?.value || []

      if (relationValue?.length) {
        for await (let item of relationValue) {
          if (item.relations) {
            let workItemRelations = item.relations

            // let workItemRelations = item.relations.filter(c => c.attributes?.name === 'Child')
            for await (let relatedItem of workItemRelations) {

              // console.log({ relatedItem });

              let relatedItemId = getItemIdByURL(relatedItem.url)
              //  console.log({ relatedItemId });
              if (relatedItemId) {
                let relatedItemData = await getAllRelationsById(relatedItemId)
                // console.log({relatedItemData});
                if (relatedItemData) {
                  relatedItemData = {
                    id: relatedItemData[relatedItemId]?.id,
                    name: relatedItemData[relatedItemId]?.name,
                    relation: relatedItem?.attributes?.name,
                    ...relatedItemData[relatedItemId]
                  }
                  relations.push({
                    [relatedItemId]: relatedItemData
                  })
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log({ error });
    }

    //  console.log({relations});

    workItemTree = {
      [itemId]: {
        id: itemId,
        name: workItemData?.data?.fields['System.Title'] || '',
        description:  workItemData?.data?.fields['System.Description'] || '',
        state:  workItemData?.data?.fields['System.State'] ||  "To Do",
        relations
      }
    }

    // console.log({ workItemTree });

    return workItemTree

  } catch (e) {
    console.log({ e });
  }
}

try {
  let epicRelations = await getAllRelationsById(ITEM_ID)
  var json = epicRelations
  json = JSON.stringify(json, 2, 2)
  // console.log({json});

  fs.writeFile('relationsResult.json', json, (err, data) => {
    if (err) {
      console.log((error));
    } else {
      // console.log({data});
    }
  })
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
      markupArray += (`<li> <div class="${details.relation?.toLowerCase()} tooltip">`);
      if(details.description){
      markupArray += (`<span class="tooltiptext">${details.description}</span>`);
      }
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
        if(detail !== 'description') 

        {if(detail === 'state'){
          markupArray += (`<span> Status: ${details[detail]} </span>`);
        }
       else{
        markupArray += (`<span> ${details[detail]} </span>`);
       }}
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




