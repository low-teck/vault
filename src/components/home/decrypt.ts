import CryptoJS from "crypto-js";

const { ipcRenderer } = window.require("electron");

export const decrypt = async (input: any) => {
	var file = input.file.file;
	let key = await ipcRenderer.invoke("GET_KEY");
	var decrypted = CryptoJS.AES.decrypt(file, key);
	// Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
	var typedArray = convertWordArrayToUint8Array(decrypted);
	// Convert: WordArray -> typed array

	var fileDec = new Blob([typedArray]); // Create blob from typed array
	downloadFunc({ filename: input.file.filename, file: fileDec });
};

export const downloadFunc = ({
	filename,
	file,
	text,
}: {
	filename: string;
	file?: any;
	text?: string;
}) => {
	console.log(filename);
	var a = document.createElement("a");
	var url = "null";
	if (text) {
		url = window.URL.createObjectURL(
			new Blob([text], { type: "text/csv" })
		);
	}
	if (file) {
		url = window.URL.createObjectURL(file);
	}
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
};

export const convertWordArrayToUint8Array = (
	wordArray: CryptoJS.lib.WordArray
) => {
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
