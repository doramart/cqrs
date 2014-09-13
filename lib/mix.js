function mix(obj, methods) {

    var mns = Object.keys(methods);

    mns.forEach(function (mn) {
        obj[mn] = methods[mn];
    });

    return obj;

}