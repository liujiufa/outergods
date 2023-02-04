
export const decimalNum = (num: string|number = 0, decimal=2, delimiter="") => {
    const big = num ? num.toString() : "0"
    const bigArr = big.split(".")
    let intStr = ''
    let decStr = bigArr[1]?.slice(0, decimal) || "0"
    bigArr[0].split("").reverse().forEach((item, idx)=>{
        if(!!idx && !(idx % 3) && (idx !== (bigArr[0].length-1))) {
            intStr = item + delimiter + intStr
        } else {
            intStr = item + intStr
        }
    })
    if(Number(decimal)) {
        for (let index = decStr.length; index < decimal; index++) {
            decStr += "0"
        }
        intStr += "." + decStr
    }
    return intStr
}
