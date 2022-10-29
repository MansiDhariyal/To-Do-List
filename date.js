// module.exports.getDate=function(){ module.exports can be replaced with exports
exports.getDate=function(){
let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return today.toLocaleDateString("en-US",options);
 
}
module.exports.getDay=function() {
let today = new Date();
    let options = {
        weekday: "long",
    }
    return today.toLocaleDateString("en-US",options);

}