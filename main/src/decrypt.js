var AES = require("crypto-js/aes");
const keytar = require("keytar");

const decrypt = (input, username) => {
    var file = input;
    var reader = new FileReader();
    reader.onload = async () => {
        var key = await keytar.getPassword("vault_enc_key", username);
        if (!reader.result) return;
        // @ts-ignore
        var decrypted = AES.decrypt(reader.result, key); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array

        var fileDec = new Blob([typedArray]); // Create blob from typed array

        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var filename = file.name.substr(0, file.name.length - 4);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    reader.readAsText(file);
};

const convertWordArrayToUint8Array = (wordArray) => {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes")
        ? wordArray.sigBytes
        : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
        index = 0,
        word,
        i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
};

module.exports = {
    decrypt,
};
