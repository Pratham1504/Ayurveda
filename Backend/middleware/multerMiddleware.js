const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads")
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer ({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024 
    }
})
module.exports = upload;