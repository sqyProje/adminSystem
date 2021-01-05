'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.1.5:8088"' //http://localhost:8080
 //  BASE_API: '"https://oa.hnjkqd.com"'//http://oa.hnjkqd.com/
 // BASE_API:'"https://gkoa.rzsgkyy.com"'
})
