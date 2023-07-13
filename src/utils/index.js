const mapdbtoalbums = ({id, name, year}) => ({id, name, year})
const mapdbtosongs = ({
	id,
	title, 
	year, 
	performer, 
	genre, 
	duration, 
	albumId}) => ({
	id,
	title, 
	year, 
	performer, 
	genre, 
	duration, 
	albumId
})

module.exports = {
	mapdbtoalbums,
	mapdbtosongs
}