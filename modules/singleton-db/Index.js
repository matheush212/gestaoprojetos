const sqlite3 = require('sqlite3').verbose();

var Instance = (function () {
    var instance;
    var object;

    return {
        createInstance: function(caminho_db) {
            try{
                object = new sqlite3.Database(caminho_db, (err) => { 
                    if (err)
                        console.log(err);
                });
            }
            catch(err){
                console.log(err);
            }
        },
        getInstance: function () {
            if (!instance) {
                instance = object;
            }
            return instance;
        }
    };
})();
exports.Instance = Instance;