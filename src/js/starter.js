import {diagnose} from 'cbor2';
import {decode, decodeStrByArr} from "./fido_decoder.js";

export default function main(window, document) {
    const inEl = document.querySelector(".input");
    const resEl = document.querySelector(".hexdecoded");
    const resCborEl = document.querySelector(".cbor");
    inEl.onchange = () => {
        let inputVal = inEl.value.toLowerCase();
        const prefix = "fido:/";

        if (inputVal.startsWith(prefix)) {
            inputVal = inputVal.slice(prefix.length);
        } else {
            console.log("inputVal2", inputVal);
        }
        console.log("inputVal", inputVal);
        const arr = decode(inputVal);
        const arrStr = decodeStrByArr(arr);
        resEl.textContent = arrStr;

        const u8Arr = new Uint8Array(arr);
        const cborStr = diagnose(u8Arr);
        resCborEl.textContent = cborStr;
    }
}
