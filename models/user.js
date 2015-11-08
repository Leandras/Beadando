var bcrypt = require("bcryptjs");

module.exports = {
    identity : 'user',
    connection : 'default',
    attributes : {
        azon : {
            type : 'string',
            required : true,
            unique : true,
            primaryKey : true,
        },
        password : {
            type : 'string',
            required : true,
        },
        vezeteknev : {
            type: 'string',
            required : true,
        },
        keresztnev : {
            type: 'string',
            required : true,
        },
        ceg : {
            type : 'string',
        },
        varos : {
            type: 'string',
        },
        isMunkaado : {
            type:   'boolean',
            required    :   true,
            defaultsTo  : 'false',
            boolean     : true,
        },
        engedely : {
            type : 'string',
            enum : ['munkaado', 'munkavallalo'],
            required : true,
            defaultsTo : 'munkavallalo'
        },
        validPassword : function (password) {
            return bcrypt.compareSync(password, this.password)
        },
        
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
};