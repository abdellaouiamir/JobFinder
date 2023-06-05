const { config } = require('dotenv')
config()

module.exports = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    SEND_EMAIL: process.env.SEND_EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}