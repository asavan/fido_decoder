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

export function decode(input) {
    return Array.from(input)
        .reduce((acc, _, i, arr) => {
            if (i % 17 === 0) {
                const chunk = arr.slice(i, i + 17);
                const s = chunk.join('');
                let n;
                switch (s.length) {
                    case 3:
                        n = 1;
                        break;
                    case 5:
                        n = 2;
                        break;
                    case 8:
                        n = 3;
                        break;
                    case 10:
                        n = 4;
                        break;
                    case 13:
                        n = 5;
                        break;
                    case 15:
                        n = 6;
                        break;
                    case 17:
                        n = 7;
                        break;
                    default:
                        throw new Error('Unexpected length');
                }
                const num = BigInt(s);
                const bytes = [];
                let temp = num;
                for (let j = 0; j < n; j++) {
                    bytes.push(Number(temp & 0xffn));
                    temp >>= 8n;
                }
                acc.push(...bytes);
            }
            return acc;
        }, []);
}

export function decodeStrByArr(arr) {
    return arr.map(b => b.toString(16).padStart(2, '0')).join(' ');
}

export function decodeStr(input) {
    return decodeStrByArr(decode(input));
}
