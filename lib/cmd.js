
var fs= require('fs');
exports.getFilesizeInBytes = function(filename) {
        var fileSizeInBytes = 0;
        try{
             var stats = fs.statSync(filename);
             fileSizeInBytes = stats["size"];
          }catch (e) {
               console.log('error to know',filename,e);
                return 0;
            }
             return fileSizeInBytes;
         };
exports.addNewFile = function(path,context){
        fs.writeFile(path , context, function (err) {
              if (err) throw err;
                console.log('It\'s saved!');
            }); 
        };
exports.getVersion =function(){
json = JSON.parse(fs.readFileSync('package.json', 'utf8'))
return json.version;
}
