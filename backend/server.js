const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const joi = require('joi')
const { MongoClient } = require('mongodb')
const { authenticateToken } = require('./middleware/validate')
require('dotenv').config()
const FRONTEND_URL = process.env.FRONTEND_SERVER_URL
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

const DB_URL = process.env.MONGO_DB_URL
let refreshTokens = []

async function connectToDB() {
  const client = new MongoClient(DB_URL)

  try {
    await client.connect()
    const db = client.db('baigiamasis_darbas')
    return db
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function createUser(db, user) {
  try {
    await db.collection('users').insertOne(user)
    console.log('User inserted:', user)
  } catch (error) {
    console.error('Error inserting user:', error)
    throw error
  }
}

async function findUserByUsername(db, username) {
  try {
    return await db.collection('users').findOne({ username })
  } catch (error) {
    console.error('Error finding user by username:', error)
    throw error
  }
}

app.post('/register', async (req, res) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const username = req.body.username
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" })
  }

  try {
    const db = await connectToDB()

    const existingUser = await findUserByUsername(db, username)
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, password: hashedPassword }
    await createUser(db, newUser)

    const accessToken = generateAccessToken({ name: newUser.username }, '15s')
    const refreshToken = jwt.sign(
      { name: newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

async function checkExistingFavorite(db, username, filmId, mediaType) {
  const existingFavorite = await db.collection('favorites').findOne({
    username: username,
    filmId: filmId,
    mediaType: mediaType,
  })
  return existingFavorite
}

app.post('/favorites', authenticateToken, async (req, res) => {
  const favoritesSchema = joi.object({
    filmId: joi.number().integer().min(1).required(),
    mediaType: joi.string().valid('movie', 'tv').required(),
  })

  try {
    const { error } = favoritesSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { filmId, mediaType } = req.body
    const db = await connectToDB()

    const user = await findUserByUsername(db, req.user.name)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if the movie with the same filmId and mediaType already exists in favorites
    const existingFavorite = await checkExistingFavorite(
      db,
      user.username,
      filmId,
      mediaType
    )
    if (existingFavorite) {
      return res
        .status(409)
        .json({ error: 'Movie already exists in favorites' })
    }

    await db
      .collection('favorites')
      .insertOne({ username: user.username, filmId, mediaType })
    res.json({ message: 'Favorite saved successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/favorites', authenticateToken, async (req, res) => {
  const db = await connectToDB()

  try {
    const user = await findUserByUsername(db, req.user.name)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const favorites = await db
      .collection('favorites')
      .find({
        username: user.username,
      })
      .toArray()

    res.json({ favorites })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/favorites/:filmId', authenticateToken, async (req, res) => {
  const { filmId } = req.params
  const db = await connectToDB()

  try {
    const user = await findUserByUsername(db, req.user.name)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const result = await db.collection('favorites').deleteOne({
      username: user.username,
      filmId: parseInt(filmId),
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' })
    }

    res.json({ message: 'Favorite deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken === null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name }, '1d')
    res.json({ accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  try {
    const db = await connectToDB()

    const user = await findUserByUsername(db, username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    const accessToken = generateAccessToken({ name: user.username }, '15s')
    const refreshToken = jwt.sign(
      { name: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

function generateAccessToken(user, expiresIn) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn })
}

app.listen(process.env.PORT, () => {
  console.log('Server running...')
})
