// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

const {
  version,
  formatHttpRequest,
  formatHttpResponse
} = require('@elastic/ecs-helpers')

function build () {
  return {
    formatters: {
      level (label, number) {
        return {
          log: {
            level: label,
            logger: 'pino'
          }
        }
      },

      bindings (bindings) {
        return {
          process: {
            pid: bindings.pid
          },
          host: {
            hostname: bindings.hostname
          }
        }
      },

      log (obj) {
        const {
          req,
          request,
          res,
          response,
          ...ecs
        } = obj

        ecs.ecs = { version }

        if (req || request) {
          formatHttpRequest(ecs, req || request)
        }

        if (res || response) {
          formatHttpResponse(ecs, res || response)
        }

        return ecs
      }
    },
    messageKey: 'message',
    timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`
  }
}

module.exports = build
