const express = require('express');
const md5 = require('md5');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

const dotenv = require("dotenv")
dotenv.config()

const usersJson = require('./userData.json');
const mqtt = require('mqtt')

const client  = mqtt.connect(`mqtt://${process.env.THINGHOST}`, {
    username: process.env.TOKEN
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  for (const user of usersJson.users)
  {
    if (username === user.username && md5(password) === user.password)
    {
      // removing data values, not needed at frontend
      const devs = []
      for (const d of user.devices)
      {
        devs.push(
          {name: d.name}
        )
      }
      res.status(200).send({name: username, devices: devs});
      return;
    }
    
  }
  res.status(200).json({ user: null });
})


app.post('/publish', async (req, res) => {
  const { user, name, status } = req.body
  let val = ''
  for (const u of usersJson.users)
  {
    if (u.username === user.name)
    {
      for (const dev of u.devices)
      { 
        if (dev.name === name)
        {
          val = dev.data
        }
      }
    }
  }

  try
  {
    await client.publish("v1/devices/me/attributes", JSON.stringify({'device': name, status, 'code': val}));
    console.log('successfully sent publish data', val)
  }
  catch (error) 
  {
      res.status(500).json({ message: 'mqtt error' });  
  }

  return;
})


app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
