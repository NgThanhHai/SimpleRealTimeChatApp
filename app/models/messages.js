module.exports = function(sequelize, Sequelize) {
	var Message = sequelize.define('message', {

		message :{
		 type: Sequelize.TEXT
		},
		time: {
			type: Sequelize.TEXT
		}
	});
	return Message;
}