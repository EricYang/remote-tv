var encryptor = require('file-encryptor');
var options = { algorithm: 'aes256' };
exports.encryptFile=function(input_file, encrypted_data, key, cb){
    // Encrypt file.
    encryptor.encryptFile(input_file, encrypted_data, key, options, function(err) {
        // Encryption complete.
        cb(err);
    });
}

exports.decryptFile=function(encrypted_data, output_file, key, cb){
    // Decrypt file.
    encryptor.decryptFile(encrypted_data, output_file, key, options, function(err) {
        // Decryption complete.
        cb(err);
    });
}

