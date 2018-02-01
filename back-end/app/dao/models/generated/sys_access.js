/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_access', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		desc: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		enable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1',
        get() {
            const e = this.getDataValue('enable');
            return !!e
        },
        set(val) {
            this.setDataValue('enable', val?1:0);
        }
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
		tableName: 'sys_access',
		timestamps: false,
		freezeTableName: true
	});
};
