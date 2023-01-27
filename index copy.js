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
                if (relatedItemData) {
                  relatedItemData = { relation: relatedItem?.attributes?.name, ...relatedItemData[relatedItemId] }
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
  const getData = async () => {
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
  }

  // array to hold HTML tags
  let markupArray = ["<ul>"];

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
      markupArray.push(`<li> <div class="test">`);
      // fetch the parent object
      let details = items[item];
      getDetails(details);
      // push the closing tag for parent
      markupArray.push("</li>");
    }
  };

  // get details
  const getDetails = (details) => {
    // iterate over the detail items of object
    for (const detail in details) {
      // fetch the value of each item
      if (detail == "relations" && details[detail].length) {
        markupArray.push("</div><ul>");
        details[detail].forEach((element) => {
          getItems(element);
        });
        markupArray.push("</ul>");
      } else {
        markupArray.push(`<span> ${details[detail]} </span>`);
      }
    }
  };

  // call the function on page load
  window.onload = async () => {
    //getData()
    let epicRelations = {
      "11": {
        "id": "11",
        "name": "Task 2",
        "relations": [
          {
            "14": {
              "id": "14",
              "name": "Post-Task 2.1",
              "relation": "Successor",
              "relations": []
            }
          },
          {
            "13": {
              "id": "13",
              "name": "Pre-Task 2.1",
              "relation": "Predecessor",
              "relations": []
            }
          },
          {
            "12": {
              "id": "12",
              "name": "Child 2.1",
              "relation": "Child",
              "relations": []
            }
          },
          {
            "1": {
              "id": "1",
              "name": "Migration from React Version 17 to 18",
              "relation": "Parent",
              "relations": [
                {
                  "2": {
                    "id": "2",
                    "name": "Todos",
                    "relation": "Child",
                    "relations": [
                      {
                        "10": {
                          "id": "10",
                          "name": "Task 1",
                          "relation": "Child",
                          "relations": []
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }

    createList(epicRelations);
    markupArray.push("</ul>");
  //  $("#list").html(markupArray.join(""));
  };
}
catch (error) {
  console.log({ error });
}




