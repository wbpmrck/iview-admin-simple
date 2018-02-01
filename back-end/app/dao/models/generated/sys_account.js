/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_account', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		account_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		password_secret: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		create_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		update_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'sys_account',
		timestamps: false,
		freezeTableName: true
	});
};
