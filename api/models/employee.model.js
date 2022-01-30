module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: { msg: "Email Must be unique"},
            validate:{
                isEmail : {msg: 'Not an Email Address'}
            }
        }
    },
        {
            indexes:[
                {
                    unique: false,
                    fields:['email']
                }
            ]
        });

    return Employee;
};