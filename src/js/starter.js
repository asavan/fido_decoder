import {diagnose, decode as cbrDecode} from "cbor2";
import {decode, decodeStrByArr} from "./fido_decoder.js";

const isAllDigits = (str) => [...str].every(char => char >= "0" && char <= "9");

const isValid = (str) => {
    if (!str || str.length === 0) {
        return false;
    }
    return isAllDigits(str);
};

export default function main(window, document) {
    const inEl = document.querySelector(".input");
    const resEl = document.querySelector(".hexdecoded");
    const resCborEl = document.querySelector(".cbor");
    const showDecoded = () => {
        let inputVal = inEl.value.toUpperCase();
        const prefix = "FIDO:/";
        resEl.textContent = "";
        resCborEl.textContent = "";
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
        const cborObj = Object.fromEntries(cborMap);
        const cborStr = JSON.stringify(cborObj, null, 2);
        console.log(cborObj, cborStr);
        resCborEl.textContent = diagnose(u8Arr);
    };
    inEl.oninput = showDecoded;
    showDecoded();
}
