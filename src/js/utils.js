export function multilineToHtml(s) {
    return s.replace(/\n/g, "<br>");
}

export function restoreLineBreak(str) {
    return str.replace(/\\n/g, "\n");
}

export function isAllDigits(str) {
    return [...str].every(char => char >= "0" && char <= "9");
}
