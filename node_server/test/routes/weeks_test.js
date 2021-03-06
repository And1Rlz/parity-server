import _ from 'lodash'
import chai from 'chai'
let expect = chai.expect

chai.use(require('sinon-chai'))
import request from 'request-promise'

process.env.PORT = 3002
process.env.MONGODB_URI = 'mongodb://localhost:27017/test'
const Db = require('monk')(process.env.MONGODB_URI)
const Games = Db.get('games')

describe('weeks routes', function () {
  var server = require('../../index')

  var game1 = {
    week: 1,
    stats: {
      'Mike': { 'Goals': 1 }
    }
  }

  var game2 = {
    week: 1,
    stats: {
      'Bill': { 'Goals': 1 }
    }
  }

  var stats = _.assign({}, game1.stats, game2.stats)

  before(async function () {
    server.listen(3002)
    await Games.insert(game1)
    await Games.insert(game2)
  })

  after(function () {
    Games.drop()
    server.close()
  })

  describe('GET /weeks', function () {
    var url = 'http://localhost:3002/weeks'

    it('returns a list of week numbers', async function () {
      let response = await request.get({url: url, resolveWithFullResponse: true})
      let body = JSON.parse(response.body)

      expect(response.statusCode).to.equal(200)
      expect(body).to.deep.equal([1])
    })
  })

  describe('GET /weeks/:week', function () {
    var url = 'http://localhost:3002/weeks/'

    it('returns a week', async function () {
      url = url + game1.week
      let response = await request.get({url: url, resolveWithFullResponse: true})
      let body = JSON.parse(response.body)

      expect(response.statusCode).to.equal(200)
      expect(body.week).to.equal(game1.week)
      expect(body.stats).to.deep.equal(stats)
    })
  })
})
