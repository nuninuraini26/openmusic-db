const {Pool} = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const NotFoundError = require('../../exceptions/notfound-error')

class AlbumsServices {
	constructor() {
		this._pool = new Pool()
	}

	async addAlbum({name, year}) {
		const id = 'album-'.concat(nanoid(16))
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: 
      [id, name, year]
    }
    const result = await this._pool.query(query)
    if(!result.rows[0].id) {
      throw new InvariantError('album is failed to add')
    }
    return result.rows[0].id
	}

	async getAlbumById(id) {
    const album = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }
    const songs = {
      text: 'SELECT s.id, s.title, s.performer FROM songs s INNER JOIN albums a ON a.id = s."album_id" WHERE a.id=$1',
      values: [id]
    }
    const result_album = await this._pool.query(album)
    const result_songs = await this._pool.query(songs)

    if (!result_album.rows.length) {
      throw new NotFoundError('album is not found')
    }
    return {
      id: result_album.rows[0].id,
      name: result_album.rows[0].name,
      year: result_album.rows[0].year,
      songs: result_songs.rows
    }
  }

	async editAlbumById(id, {name, year}) {
		const query = {
			text: 
			'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
			values:
            [name, year, id]
		}
		const result = await this._pool.query(query)
		if(!result.rows.length) {
			throw new NotFoundError('album is not found')
		}
	}

	async deleteAlbumById(id) {
		const query = {
			text: 
            'DELETE FROM albums WHERE id = $1 RETURNING id',
			values: 
            [id]
		}
         
		const result = await this._pool.query(query)
         
		if(!result.rows.length) {
			throw new NotFoundError('album is not found')
		}
	}
}

module.exports = { AlbumsServices }

