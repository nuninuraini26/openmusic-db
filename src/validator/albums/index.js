const InvariantError = require('../../exceptions/invariant-error')
const {AlbumPayloadsSchema} = require('./schema')

const AlbumsValidator = {
    validateAlbumPayloads: (payload) => {
        const validationResult = AlbumPayloadsSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
}

module.exports = AlbumsValidator
