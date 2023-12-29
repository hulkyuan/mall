'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://111.229.115.233:8086"',
  // BASE_API: '"https://admin-api.macrozheng.com"'
})