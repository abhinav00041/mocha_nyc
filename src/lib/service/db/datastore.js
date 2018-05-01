import Mongoose from 'mongoose'
import config from 'config'
import bluebird from 'bluebird'

export default datastore()

function datastore () {
  const mongoDBHost = config.get('MONGODB_HOST')
  const mongoDBPort = config.get('MONGODB_PORT')


  Mongoose.connect(`mongodb://${mongoDBHost}:${mongoDBPort}/flexin`)
  Mongoose.Promise = bluebird
  Mongoose.set('debug',true)
  return {
    addToStore: async function addToStore (obj) {
      console.log("Object to save   "+JSON.stringify(obj))
      return new Promise((resolve, reject)=>{
        obj.save(function (err, doc) {
          if (err) {
            reject(err)
          } else {
            resolve(doc)
          }
        })
      })
    },
    findAll: async function findAll (model) {

      return new Promise((resolve, reject) => {
        model.find({}, (err, doc) => {
          if (err) {
            reject(err)
          } else {
            resolve(doc)
          }
        }) 
      })
    },
    findOne: async function findOne (model,planname) {
      return new Promise((resolve, reject) => {
         model.findOne({plantitle: planname}, (err, doc) => {
          if (err) {
            reject(err)
          } else {
            (doc) ? resolve(doc) : reject('Pricing plan with id: ' + id + ' not found!')
          }
        }) 
      })
    },
    upsert: async function upsert(model, id, data){
      console.log("final "+data )
      return new Promise((resolve,reject) =>{
        model.findOneAndUpdate(id , data,{new:true,upsert:true} ,(err, doc) => {
          if (err) {
            reject(err)
          } else {
            (doc) ? resolve(doc) : reject('Pricing plan with id: ' + id + ' not found!')
          }
        }) 
      })
    }
  }
}
