import axiosWithAuth from '../utils/axiosWithAuth.js';
import { getItemIdByURL } from '../utils/helperFuns.js';


export const fetchRelations = (ids) => {

    if(!ids || (ids && !ids.length)) return Promise.reject('')

    return new Promise((resolve, reject) => {
        axiosWithAuth({
            url: `workitems?ids=${ids}&$expand=relations`,
            method: 'get'
        })
            .then(resolve)
            .catch((err) => {
              console.log({err});
                return console.log(`Error Occured: ${err.message}`)
            })
    })
}
export const fetchWorkItem = (id)=>{

    if(!id) return Promise.reject('')

    return new Promise((resolve, reject) => {
        axiosWithAuth({
            url: `workitems/${id}?api-version=6.0`,
            method: 'get'
        })
            .then(resolve)
            .catch((err) => {
              console.log({errrr: err});
                return console.log(`Error Occured: ${err.message}`)
            })
    })
}

export const getAllRelationsById = async (itemId, traversedItems=[]) => {
    try {
      if (traversedItems.includes(itemId)) return
      traversedItems.push(itemId)
      let workItemTree = {}, relations = []
  
      // fetch work item
      let workItemData = await fetchWorkItem(itemId)
  
      try {
  
        // fetch work item relations 
        let workItemRelations = await fetchRelations([itemId])
        let relationValue = workItemRelations?.data?.value || []
  
        if (relationValue?.length) {
          for await (let item of relationValue) {
            if (item.relations) {
              let workItemRelations = item.relations
              for await (let relatedItem of workItemRelations) {
  
                let relatedItemId = getItemIdByURL(relatedItem.url)
                if (relatedItemId) {
                
                  let relatedItemData = await getAllRelationsById(relatedItemId, traversedItems)
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
  
      workItemTree = {
        [itemId]: {
          id: itemId,
          type: workItemData?.data?.fields['System.WorkItemType'] || "",
          name: workItemData?.data?.fields['System.Title'] || '',
          description: workItemData?.data?.fields['System.Description'] || '',
          state: workItemData?.data?.fields['System.State'] || "To Do",
          relations
        }
      }
  
      return workItemTree
  
    } catch (e) {
      console.log({ e });
    }
  }
  