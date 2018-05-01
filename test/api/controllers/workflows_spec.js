import expect from '../../tools/expect'
import nock from 'nock'
import {promise as testThat} from 'unit.js'
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
import * as workflow from '../../../src/api/controllers/workflows'
import {errorsList} from '../../../src/lib/errors/errorsList'
import workflowService from '../../../src/lib/service/camunda/processes'
import formService from '../../../src/lib/service/curiosity/forms'
import datastore from '../../../src/lib/service/db/datastore'

import taskService from '../../../src/lib/service/camunda/tasks'
import * as task from '../../../src/api/controllers/tasks'

import testData from '../../data/testData.json'

describe('workflows', () => {
  let sandbox, response

  beforeEach(() => {
    nock.cleanAll()
    response = httpMocks.createResponse({})
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('POST_DeployWorkflow_Success', () => {
    let request = testData.POST_DeployWorkflow_Success.request
    let camundaResponse = testData.POST_DeployWorkflow_Success.camundaResponse
    let expectedResponse = testData.POST_DeployWorkflow_Success.response
    return testThat.given(() => {
      sandbox.stub(formService, 'checkIfFormExists').returns(Promise.resolve(true)) // assume form exists on curiosity
      sandbox.stub(workflowService, 'deploy').returns(Promise.resolve(camundaResponse))
    }).when(() => workflow.createWorkflow(request, response))
        .then(() => {
          expect(formService.checkIfFormExists).to.have.callCount(1)
          expect(workflowService.deploy).to.have.callCount(1)
          expect(response.statusCode).to.deep.equal(201)
          expect(response._getData().processDef).to.deep.equal(expectedResponse.processDef)
          expect(response._getData().deploymentId).to.deep.equal(expectedResponse.deploymentId)
          expect(response._getData().deploymentTime).to.deep.equal(expectedResponse.deploymentTime)
          expect(response._getData().suspended).to.deep.equal(expectedResponse.suspended)
        })
  })

  it('POST_DeployWorkflow_CamundaFails', () => {
    let request = testData.POST_DeployWorkflow_CamundaFails.request
    let camundaResponse = testData.POST_DeployWorkflow_CamundaFails.camundaResponse
    return testThat.given(() => {
      sandbox.stub(formService, 'checkIfFormExists').returns(Promise.resolve(true)) // assume form exists on curiosity
      sandbox.stub(workflowService, 'deploy').returns(Promise.reject(camundaResponse))
    }).when(() => workflow.createWorkflow(request, response))
        .then(() => {
          expect(formService.checkIfFormExists).to.have.callCount(1)
          expect(workflowService.deploy).to.have.callCount(1)
          expect(response.statusCode).to.deep.equal(camundaResponse.statusCode)
          expect(JSON.parse(response._getData())).to.deep.equal(camundaResponse.error)
        })
  })

  it('POST_DeployWorkflow_FormIDNotFound', () => {
    let request = testData.POST_DeployWorkflow_FormIDNotFound.request
    return testThat.given(() => {
      sandbox.stub(formService, 'checkIfFormExists').returns(Promise.resolve(false)) // assume form doesn't exist on curiosity
    }).when(() => workflow.createWorkflow(request, response))
        .then(() => {
          expect(formService.checkIfFormExists).to.have.callCount(1)
          expect(response.statusCode).to.deep.equal(500)
          expect(JSON.parse(response._getData())).to.deep.equal(errorsList.workflowServerError)
        })
  })

  it('GET_ListWorkflow_Success', () => {
    let dbResponse = testData.GET_ListWorkflow_Success.dbResponse
    return testThat.given(() => {
      sandbox.stub(datastore, 'findAll').returns(Promise.resolve(dbResponse))
    }).when(() => workflow.getWorkflows({}, response))
        .then(() => {
          expect(response.statusCode).to.deep.equal(200)
          expect(response._getData()).to.deep.equal(JSON.stringify(dbResponse))
        })
  })

  it('GET_WorkflowByID_Success', () => {
    let request = testData.GET_WorkflowByID_Success.request
    let dbResponse = testData.GET_WorkflowByID_Success.dbResponse
    return testThat.given(() => {
      sandbox.stub(datastore, 'findOne').returns(Promise.resolve(dbResponse))
    }).when(() => workflow.getWorkflowById(request, response))
        .then(() => {
          expect(response.statusCode).to.deep.equal(200)
          expect(response._getData()).to.deep.equal(JSON.stringify(dbResponse))
        })
  })

  it('GET_All_Tasks_List_Success', () => {
    let camundaResponse = testData.GET_All_Tasks_List_Success.camundaResponse
    return testThat.given(() => {
      sandbox.stub(taskService, 'getTasks').returns(Promise.resolve(camundaResponse))
    }).when(() => task.getTasks({}, response)
            .then(() => {
              expect(response.statusCode).to.deep.equal(200)
              expect(JSON.parse(response._getData())).to.deep.equal(camundaResponse)
            }))
  })

  it('GET_All_Tasks_List_Failure', () => {
    return testThat.given(() => {
      sandbox.stub(taskService, 'getTasks').returns(Promise.reject(errorsList.workflowServerError))
    }).when(() => task.getTasks({}, response)
            .then(() => {
              expect(response.statusCode).to.deep.equal(500)
              expect(JSON.parse(response._getData())).to.deep.equal(errorsList.workflowServerError)
            }))
  })

  it('Post_Start_Process_Success', () => {
    let request = testData.Post_Start_Process_Success.request
    let camundaResponse = testData.Post_Start_Process_Success.camundaResponse
    let dbResponse = testData.Post_Start_Process_Success.dbResponse
    return testThat.given(() => {
      sandbox.stub(datastore, 'findOne').returns(Promise.resolve(dbResponse))
      sandbox.stub(workflowService, 'startProcess').returns(Promise.resolve(camundaResponse))
    }).when(() => workflow.startProcess(request, response)
            .then(() => {
              expect(response.statusCode).to.deep.equal(200)
              expect(JSON.parse(response._getData())).to.deep.equal(camundaResponse)
            }))
  })
})
