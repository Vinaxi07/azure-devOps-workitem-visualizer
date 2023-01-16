import fs from 'fs'
import { fetchRelations, fetchWorkItem } from './services/index.js';
import { getItemIdByURL } from './utils/helperFuns.js';

const ITEM_ID = '11'
const traversedItemIds = [], traversedItems = [], traversedItemEdges = []

// --------------------get all relations by item id--------------

const getAllRelationsById = async (itemId) => {

    try {
        if (traversedItemIds.includes(itemId)) return
        traversedItemIds.push(itemId)

        let workItemTree = {}, relations = []
        let workItemData = await fetchWorkItem(itemId)

        try {
            //     console.log({ itemId, traversedItemIds });

            let workItemRelations = await fetchRelations([itemId])
            let relationValue = workItemRelations?.data?.value || []

            if (relationValue?.length) {

                //console.log({relationValue});

                for await (let item of relationValue) {
                    if (item.relations) {
                        let workItemRelations = item.relations

                        // let workItemRelations = item.relations.filter(c => c.attributes?.name === 'Child')
                        //   console.log({ workItemRelations: item.relations });
                        for await (let relatedItem of workItemRelations) {

                            // console.log({ relatedItem });

                            let relatedItemId = getItemIdByURL(relatedItem.url)
                            //  console.log({ relatedItemId });
                            if (relatedItemId) {
                                let relatedItemData = await getAllRelationsById(relatedItemId)
                                if (relatedItemData) {
                                    relatedItemData = { ...relatedItemData[relatedItemId], relation: relatedItem?.attributes?.name }
                                    relations.push(relatedItemData)

                                    // Work item connection edges
                                    traversedItemEdges.push({
                                        id: `edges-${itemId}-${relatedItemId}`,
                                        className: "normal-edge",
                                        source: itemId,
                                        target: relatedItemId
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

        // Work item tree relation
        workItemTree = {
            [itemId]: {
                id: itemId,
                name: workItemData?.data?.fields['System.Title'] || '',
                relations
            }
        }

        // Work item data
        traversedItems.push({
            id: itemId,
            data: { label: workItemData?.data?.fields['System.Title'] || '' }
        })



        return workItemTree

    } catch (e) {
        console.log({ e });
    }
}

let relationsResult = await getAllRelationsById(ITEM_ID)

// console.log({relationsResult: JSON.stringify(relationsResult,2,2)});


//------------------------Generate ans store tree------------------
try {
    var json = relationsResult
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
catch (error) {
    console.log({ error });
}


//------------------------Store work items as nodes------------------------
try {
    var json = traversedItems
    json = JSON.stringify(json, 2, 2)
    // console.log({json});

    fs.writeFile('traversedItems.json', json, (err, data) => {
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

//------------------------Store work items as connection edges------------------------
try {
    var json = traversedItemEdges
    json = JSON.stringify(json, 2, 2)
    // console.log({json});

    fs.writeFile('traversedItemEdges.json', json, (err, data) => {
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
