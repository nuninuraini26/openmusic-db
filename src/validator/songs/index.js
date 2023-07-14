const InvariantError = require('../../exceptions/invariant-error')
const {SongPayloadsSchema} = require('./schema')

const SongsValidator = {
    validateSongPayloads: (payload) => {
        const validationResult = SongPayloadsSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
}

module.exports = SongsValidator
