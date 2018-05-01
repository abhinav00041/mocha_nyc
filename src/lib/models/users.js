import datastore from '../../lib/service/db/datastore'
import Mongoose from 'mongoose'

export default userModel()

function userModel () {
  const Schema = Mongoose.Schema

  const UserSchema = new Schema({

    username: {
      type: String,
      required: true,
      unique: true,
      dropDups:true,
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type:String,
      required:true

    },
    admin: Boolean

  })

  return {
    
    createNew: async function createNew (user) {
    
       console.log("Object   "+JSON.stringify(user))
      // await validateSchema(objTypes.REQOBJ, pricingPlan) // Let's validate the incoming request for the supported standard
      // add other custom methods for formatting/validation to the schema object like PricingPlanSchema.methods.someMethod = function() {}
      UserSchema.pre('save', function(next) {
        this.creationDate = new Date()
        next()
      })
    
      UserSchema.set('toJSON', {
        transform: function (doc, ret, options) {
          ret.id = ret._id
          delete ret._id
          delete ret.__v
        }
      }) 

      const userModel = Mongoose.model('userModel', UserSchema)

      return await datastore.addToStore(new userModel(user))
    },
    getAll: async function getAll () {

      const userModel = Mongoose.model('userModel', UserSchema,'usermodels')
      return await datastore.findAll(userModel)
    },
    getuser: async function getByname (username) {
      const userModel = Mongoose.model('userModel', UserSchema)
      return await datastore.findOne(userModel,username)
    }
  }
}
