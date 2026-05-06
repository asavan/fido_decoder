import {diagnose, decode as cbrDecode} from "cbor2";
import {decode, decodeStrByArr} from "./fido_decoder.js";
import {isAllDigits, restoreLineBreak} from "./utils.js";
import {cryptoKeyToString, importCompressedPublicKey} from "./crypto.js";

import {Html5QrcodeScanner, Html5QrcodeScanType} from "html5-qrcode";

const isValid = (str) => {
    if (!str || str.length === 0) {
        return false;
    }
    return isAllDigits(str);
};

function shortModeToMode(s) {
    const modeMap = {
        "mc": "makeCredential",
        "ga": "getAssertion"
    };
    return modeMap[s];
}

async function decodeMap(map) {
    const pubKeyCompressed = map.get(0);
    const pubKey = await importCompressedPublicKey(pubKeyCompressed, window);
    console.log(pubKey);

    const pubKeyStr = await cryptoKeyToString(pubKey, window);

    const date = new Date(map.get(3) * 1000);
    const answer = {
        "pubKey": pubKeyStr,
        "secret": map.get(1).toHex(),
        "num_servers": map.get(2),
        "date": date.toString(),
        "isStateAssisted": map.get(4),
        "mode": shortModeToMode(map.get(5))
    };
    return answer;
}

export default function main(window, document) {
    const inEl = document.querySelector(".input");
    const resEl = document.querySelector(".hexdecoded");
    const resCborEl = document.querySelector(".cbor");
    const resCborDecodedEl = document.querySelector(".cbor_decoded");


    const showDecoded = async () => {
        let inputVal = inEl.value.toUpperCase();
        const prefix = "FIDO:/";
        resEl.textContent = "";
        resCborEl.textContent = "";
        resCborDecodedEl.textContent = "";
        if (inputVal.startsWith(prefix)) {
            inputVal = inputVal.slice(prefix.length);
        }
        console.log("inputVal", inputVal);
        if (!isValid(inputVal)) {
            return;
        }
        const arr = decode(inputVal);
        const arrStr = decodeStrByArr(arr);
        resEl.textContent = arrStr;
        const u8Arr = new Uint8Array(arr);
        const cborMap = cbrDecode(u8Arr);
        console.log(cborMap);
        resCborEl.textContent = diagnose(u8Arr);

        const decodedCbor = await decodeMap(cborMap);
        const decodedCborStr = JSON.stringify(decodedCbor, null, 2);
        resCborDecodedEl.innerText = restoreLineBreak(decodedCborStr);
    };
    inEl.oninput = showDecoded;

    function onScanSuccess(decodedText, decodedResult) {
        // Handle on success condition with the decoded text or result.
        console.log(`Scan result: ${decodedText}`, decodedResult);
        inEl.value = decodedText;
        showDecoded();
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", {
            fps: 10, qrbox: 250, supportedScanTypes: [
                Html5QrcodeScanType.SCAN_TYPE_FILE,
                Html5QrcodeScanType.SCAN_TYPE_CAMERA
            ]
        });
    html5QrcodeScanner.render(onScanSuccess);

    showDecoded();
}
