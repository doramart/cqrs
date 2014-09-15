
// Wrap aggregate object
// Return a new object
// The object
module.exports = function(obj){

    var wrap = {
        get:function(k){
            return obj.get(k);
        }
    }

    for(var k in obj){
        if(!obj.hasOwnProperty(k)){
            wrap[k] = obj[k].bind(obj);
        }
    }

    return wrap;
}