import cors from 'cors'
import SwaggerExpress from 'swagger-express-mw'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import * as YAML from 'yamljs'
import * as path from 'path'

const version = {
  file: YAML.load(path.join(__dirname, 'version.yml'))
}

var config = {
  appRoot: __dirname,
  swaggerFile: path.resolve(__dirname, 'api', 'swagger', 'swagger.json'),
  basePath: '/api/v1'
}

export default function start (serverPort) {
  SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
      throw err
    }

    var app = require('express')()

    // Hack to override the host and port
    app.get(path.resolve(config.basePath, '/api-docs'), function (req, res) {
      swaggerExpress.runner.swagger.host = req.get('host')
      // Set correct version for the API
      swaggerExpress.runner.swagger.info.version = version.file.build.name
      res.json(swaggerExpress.runner.swagger)
    })

    // Customize SwaggerUI
    var swaggerUIParams = {
      swaggerUi: config.basePath + '/docs',
      apiDocs: config.basePath + '/api-docs'
    }

    // Add for version
    app.get('/version', function (req, res) {
      // Load yaml file using YAML.load

      res.json(version.file.build)
    })

    // serves the Swagger documents and Swagger UI
    app.use(swaggerExpress.runner.swaggerTools.swaggerUi(swaggerUIParams))

    app.use(cors())

    app.use(bodyParser.json())

    app.use(timeout('6s'))

    // install middleware
    swaggerExpress.register(app)

    app.listen(serverPort)
  })
}
