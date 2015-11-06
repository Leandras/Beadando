module.exports = {
    identity : 'munka',
    connection : 'default',
    attributes : {
        azonosito : {
            type : 'int',
            defaultsTo : function (){
                return Math.floor((Math.random() * 100) + 10);
            },
            required : 'true',
            unique : true,
        },
        varos : {
            type : 'string',
            required : true,
        },
        tipus : {
            type : 'string',
            required : true,
        },
        date : {
            type : 'datetime',
            defaultsTo : function () {
                return new Date();
            },
            required : true,
        },
        leiras :{
            type : 'string',
            required : true,  
        },
        status : {
            type : 'string',
            enum : ['free', 'taken', 'pending'],
            required : true,
        },
        oraber : {
            type : 'int',
            required : true,
        },
        user : {
            model : 'user',
        },
    }
};