var fs = require('fs');
var shell = require('shelljs');

var dir = '/home/learnitdeep/smartcontract-security-checker/dataset/VulnerableSCs/RuntimeBinary';
var files = fs.readdirSync(dir);

for(var i=0; i<files.length; i++){
    var file = files[i];
    var file_path = '/smartcontract-security-checker/dataset/VulnerableSCs/RuntimeBinary/'+file;
    var _output = shell.exec('sudo docker run -v /home/learnitdeep/smartcontract-security-checker:/smartcontract-security-checker --name test luongnguyen/oyente /bin/bash -c "cd oyente; python oyente.py -s '+file_path+' -b"', {async:false});
    var output = _output.stderr;

    if (shell.exec('sudo docker rm test').code !== 0) {
        shell.echo('Error: Git commit failed');
        shell.exit(1);
    }

    
}
/*    
    fs.writeFileSync('./output'+String(getTokenDoneCount)+'.txt', output, function(err){
        if(err) {
            return console.log(err);
        }
    });
*/
