const Sequelize= require('sequelize')

const sequelize = new Sequelize(
    'test-db','user','pass',{
        dialect:'sqlite',
        host:'./db/test.sqlite'
    }
)
module.exports = sequelize