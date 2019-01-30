var bb = {
    log: function(str){
        console.log(str);
        this.Console.addLog(str);
    }
};
module.exports = bb;