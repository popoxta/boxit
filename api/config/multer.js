const multer = require('multer')
const storage = multer.memoryStorage()

const multerHandleUpload = multer({
    storage,
    limits: {fileSize: 10000000} // 10mb max
})

module.exports = multerHandleUpload