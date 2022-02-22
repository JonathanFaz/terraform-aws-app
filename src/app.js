const CONFIG = require('./config')
const express = require('express');
const Sequelize = require('sequelize')
const app = express();
const PORT = 3000
app.use(express.urlencoded({ extended: false }));
const sequelize = new Sequelize(
  CONFIG.DB_NAME,
  CONFIG.DB_USER,
  CONFIG.DB_PASS,
  {
    host: CONFIG.DB_URL.split(":")[0],
    port: CONFIG.DB_URL.split(":")[1],
    dialect: 'mysql',
  }
);
sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');
    try{
      await sequelize.query(
        'CREATE TABLE `exercise_db`.`pets` (`name` VARCHAR(20) NULL DEFAULT NULL, `owner` VARCHAR(20) NULL DEFAULT NULL, `species` VARCHAR(20) NULL DEFAULT NULL, `sex` CHAR(1) NULL DEFAULT NULL)',
        { type: sequelize.QueryTypes.RAW}
      )
      await sequelize.query(
        "INSERT INTO `pets`(`name`, `owner`, `species`, `sex`) VALUES ('jacobo','jonathan','dog','M')",
        { type: sequelize.QueryTypes.RAW}
      )
    }catch(err){
      console.log("Table Already Exist")
    }
    app.listen(PORT, () => {
        console.log(`Listening for requests on http://localhost:${PORT}`);
    })
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const Pet = sequelize.define(
  'pet',
  {
    name: sequelize.Sequelize.STRING,
    owner: sequelize.Sequelize.STRING,
    species: sequelize.Sequelize.STRING,
    sex: sequelize.Sequelize.STRING,
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);
Pet.removeAttribute('id');

app.get('/api/pet/:name', (req, res) => {
  Pet.findOne({
    where: {
      name: req.params.name,
    },
  })
    .then( (petRow) => {
      if(petRow){
        res.json({
          name: petRow.name,
          owner: petRow.owner,
          specie: petRow.species,
        })  
      }else{
        res.json({})
      }
    })
    .catch((err)=>{
      res.status(500).json({ message: 'Internal server error' });
    })
})