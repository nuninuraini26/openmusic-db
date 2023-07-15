/* eslint-disable camelcase */


exports.up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'CHAR(22)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
    })
    pgm.createTable('songs', {
        id: {
            type: 'CHAR(21)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        duration: {
            type: 'INT',

        },
        album_id: {
            type: 'CHAR(22)',

        },
    })
}

exports.down = (pgm) => {
    pgm.dropTable('albums')
    pgm.dropTable('songs')
}
