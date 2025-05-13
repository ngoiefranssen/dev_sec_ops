const path = require('path')
const fs = require('fs')
const sharp = require('sharp');

class Upload {

    static destinationPath = path.resolve('./') + path.sep + 'public' + path.sep + 'uploads'

    /**
     * Sauvegarder l'image et génerer
     * son thumbnail
     */
    static async save(file, options = { destination: "", compressed: true }) {
        try {
            let fileDestination;

            if (options.destination) {
                fileDestination = this.destinationPath + path.sep + options.destination.split('/').join(path.sep) + path.sep + file.name;
            }

            const extname = fileDestination ? path.extname(fileDestination) : path.extname(file.name)
            const defaultFileName = Date.now() + extname

            const finalFileName = fileDestination ? Date.now() + '_' + path.basename(fileDestination) : defaultFileName

            const destinationFolder = fileDestination ? path.dirname(fileDestination) : this.destinationPath
            const filePath = destinationFolder + path.sep + finalFileName

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder, { recursive: true })
            }

            const isImage = ['image/jpeg', 'image/gif', 'image/png'].includes(file.mimetype)

            let fileInfo = {}

            if (isImage && (options.compressed ?? true)) {
                console.log(filePath);
                fileInfo = await sharp(file.data).resize(500).toFormat(extname.substring(1), { quality: 100 }).toFile(filePath)
            } else {
                fileInfo = await file.mv(filePath.toLowerCase())
            }

            let uploadedDir = 'uploads' + (fileDestination ? path.sep + options.destination.split('/').join(path.sep) : "") + path.sep;

            return {
                fileInfo: { ...fileInfo, fileName: uploadedDir + finalFileName },
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = Upload