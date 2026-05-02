/* eslint-disable @stylistic/max-len */

/*
import cbor2, math;
uri='FIDO:/...';
ns=uri.split('/')[-1];
bs=(int(n, 10).to_bytes(int(math.log2(10**len(n))//8), 'little') for n in (ns[ii: ii+17] for ii in range(0, len(ns), 17)));
bbs = list(bs);
bbss = list(map(lambda x: x.hex(" "), bbs))
print(" ".join(bbss));
b = b''.join(bbs);
print(cbor2.loads(b));
*/

import test from "node:test";
import assert from "node:assert/strict";
import {decodeStr} from "../src/js/fido_decoder.js";

test("decoder", () => {
    const x = "000934719326783103207204847122124803232702547286292582153008251575303974089016908442253911831001011293274293663627113160064250375289974853957388140151554109321447142404";
    const decoded = decodeStr(x);
    const expected = "a6 00 58 21 03 55 00 00 a4 58 b0 5b f1 71 14 d9 fe 36 20 7c 0b 9a 0f 2d f6 81 d2 ce 06 0a 96 09 21 30 8d 5d 94 01 50 86 88 bf 14 a5 76 06 dd 72 61 a4 5c f5 8f 5a 48 02 02 03 1a 69 f5 b1 bf 04 f4 05 62 6d 63";
    assert.strictEqual(decoded, expected, "must be 2");
});
