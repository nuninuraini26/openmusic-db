const {Pool} = require('pg')
const { nanoid } = require('nanoid')
const { mapdbtoalbums } = require('../../utils')
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
		const query = {
			text: 
            'SELECT * FROM notes WHERE id = $1',
			values: [id],
		}
		const result = await this._pool.query(query)
     
		if (!result.rows.length) {
			throw new NotFoundError('album is not found')
		}
     
		return result.rows.map(mapdbtoalbums)[0]
	}
    
	async editAlbumById(id, {name, year}) {
		const query = {
			text: 
            'UPDATE notes SET name = $1, year = $2, id = $3 RETURNING id',
			values:
            [name, year, id]
		}
		const result = await this._pool.query(query)
		if(!result.rows.length) {
			throw new NotFoundError('album is not found')
		}
	}

	async deleteNoteById(id) {
		const query = {
			text: 
            'DELETE FROM albums WHERE id = $1 RETURNING id',
			values: 
            [id],
		}
         
		const result = await this._pool.query(query)
         
		if(!result.rows.length) {
			throw new NotFoundError('album is not found')
		}
	}
}

module.exports = { AlbumsServices }

