import fs from 'fs'
import { fetchRelations, fetchWorkItem } from './services/index.js';
import { getItemIdByURL } from './utils/helperFuns.js';

const ITEM_ID = '11'
const traversedItems = []

// --------------------get all relations by item id--------------

const getAllRelationsById = async (itemId) => {

    try {
        if (traversedItems.includes(itemId)) return
        traversedItems.push(itemId)

        let workItemTree = {}, relations = []
        let workItemData = await fetchWorkItem(itemId)

        //    console.log({workItemData:workItemData?.data?.fields});

        try {
            //     console.log({ itemId, traversedItems });

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
                                    console.log({ before: relatedItemData });

                                   relatedItemData = {...relatedItemData[relatedItemId], relation: relatedItem?.attributes?.name}
                                   relations.push(relatedItemData)
                                    console.log({ after: relatedItemData });
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

let epicRelations = await getAllRelationsById(ITEM_ID)

// console.log({epicRelations: JSON.stringify(epicRelations,2,2)});

try {
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
catch (error) {
    console.log({ error });
}


