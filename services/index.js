import axiosWithAuth from '../utils/axiosWithAuth.js';

export const fetchTeamsAndIterations = () => {

    return new Promise((resolve, reject) => {
        axiosWithAuth({
            url: "/classificationnodes?$depth=3&api-version=5.1",
            method: 'get'
        })
            .then(resolve)
            .catch((err) => {
                return console.log(`Error Occured: ${err.message}`)
            })
    })
}

export const fetchRelations = (ids) => {

    if(!ids || (ids && !ids.length)) return Promise.reject('')

    return new Promise((resolve, reject) => {
        axiosWithAuth({
            url: `workitems?ids=${ids}&$expand=relations`,
            method: 'get'
        })
            .then(resolve)
            .catch((err) => {
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
                return console.log(`Error Occured: ${err.message}`)
            })
    })

}

