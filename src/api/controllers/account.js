import users from '../../lib/models/users'
import userSerializer from '../../lib/serializers/userSerializer'
import {errorsList} from '../../lib/errors/errorsList'

export async function createUser (req, res) {

  const reqbody = req.swagger.params.user.value
  try {        
    const deserializeData = await userSerializer.deserialize(reqbody)
    console.log(deserializeData)
    const userResponse = await users.createNew(deserializeData[0])
    const serializedUserResponse = await userSerializer.serialize(userResponse)
    res.status(201).send(serializedUserResponse)
  } 


catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode).json(err.error)
    } else if(err.code){
      // TODO: do something better here
     // console.log(err)
     //const deserializeError = await accountSerializer.error(errorsList.duplicateIDFound)
      res.status(409).json(errorsList.duplicateID)
    } else {
       res.status(500).json(errorsList.accountServiceError)
    }
  }
}

export async function getAll (req, res) {
  try {
    const userResponse = await users.getAll()
    const serializedUserResponse = await userSerializer.serialize(userResponse)
    res.status(200).json(serializedUserResponse)

  } catch (err) {
     res.status(err.statusCode).json(err.error)
    // TODO: do something better here
    //console.log(err)
    //res.status(500).json(errorsList.pricingPlanServiceError)
  }
}

export async function getUser (req, res) {
  try {
    const userResponse = await users.getuser(req.swagger.params.Authorization.value)
    const serializedUserResponse = await userSerializer.serialize(userResponse)
    res.status(200).json(serializedUserResponse)
  } catch (err) {  
    
      res.status(err.statusCode).json(err.error)

    // TODO: do something better here
    //console.log(err)      
    //res.status(500).json(errorsList.pricingPlanServiceError)
  }
}
