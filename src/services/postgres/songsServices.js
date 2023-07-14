const {Pool} = require('pg')
const {nanoid} = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const NotFoundError = require('../../exceptions/notfound-error')
const {mapdbtosongs} = require('../../utils')

class SongsServices {
    constructor() {
        this._pool = new Pool()
    }

    async addSong({title, year, performer, genre, duration, albumId}) {
        const id = 'song-'.concat(nanoid(16))
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId],
        }
        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('song is failed to add')
        }

        return result.rows[0].id
    }

    async getSongs(parameter) {
        const query = {
            text: 'SELECT id, title, performer FROM songs',
        }
        const result = await this._pool.query(query)
        const songs = result.rows.map(mapdbtosongs)
        let filtered = songs
        if ('title' in parameter) {
            filtered = filtered.filter((song) => song.title.toLowerCase().includes(parameter.title))
        }
        if ('performer' in parameter) {
            filtered = filtered.filter((song) => song.performer.toLowerCase().includes(parameter.performer))
        }
        return filtered
    }

    async getSongById(id) {
        const query = {
            text:
            'SELECT * FROM songs WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('song is not found')
        }

        return result.rows.map(mapdbtosongs)[0]
    }

    async editSongById(id, {title, year, performer, genre, duration}) {
        const query = {
            text:
			'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
            values:
            [title, year, performer, genre, duration, id],
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('song is not found')
        }
    }

    async deleteSongById(id) {
        const query = {
            text:
            'DELETE FROM songs WHERE id = $1 RETURNING id',
            values:
            [id],
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('song is not found')
        }
    }
}

module.exports = {SongsServices}

