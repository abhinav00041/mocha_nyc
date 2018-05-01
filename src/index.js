'use strict'
import * as path from 'path'
import {PORT} from 'config'

// config module loads the configuration from the folder the process is run
process.env[ 'NODE_CONFIG_DIR' ] = path.resolve(__dirname, '/config')

import server from './server'

// Start the server
server(PORT)
