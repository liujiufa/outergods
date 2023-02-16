import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
export function toThousands(num: string) {
    let numArr = num.split('.')
    if (numArr.length > 1) {
        return parseFloat(numArr[0]).toLocaleString() + '.' + numArr[1]
    } else {
        return parseFloat(numArr[0]).toLocaleString()
    }
}
//用户地址处理方法
export function AddrHandle(addr: string, start = 4, end = 4): string | undefined {
    if (!addr) { return }
    let r = new RegExp('(.{' + start + '}).*(.{' + end + '})');
    let addrArr: RegExpMatchArray | null = addr.match(r)
    return addrArr![1] + '...' + addrArr![2]
}
export function HowLongAgo(time: number) {
    dayjs.extend(relativeTime)
    var a = dayjs()
    return a.to(new Date(time))
}
export function GetQueryString(name: string) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
export function JudgmentNumber(number: string) {
    let numArr = number.split(".")
    if (numArr.length > 1) {
        return numArr[1].length > 18
    }
    return false
}
export function NumSplic(val: string, len: number = 2) {
    var f = parseFloat(val);
    if (isNaN(f)) {
        return false;
    }
    var s = val.toString();
    if (s.indexOf(".") > 0) {
        let f = s.split(".")[1].substring(0, len)
        s = s.split(".")[0] + "." + f
    }
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + len) {
        s += '0';
    }
    return s;
}
export function dateFormat(fmt: string, date: Date) {
    let ret;
    const opt: { [key: string]: string } = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}
export function numberDivision() {

}
// export function debounce(tarFun:Function, delay:number, immed:boolean) {
// 	let timer:number|null = null
// 	let immeBool = immed
// 	return function () {
//         let Arguments=arguments
// 		const _that = this
// 		if (timer) {
// 			clearTimeout(timer)
// 		}
// 		if (immeBool) {
// 			immeBool = false
// 			tarFun.apply(_that, arguments)
// 		} else {
// 			timer = window.setTimeout(() => {
// 				timer = null
// 				tarFun.apply(_that, Arguments)
// 			}, delay)
// 		}
// 	}
// }