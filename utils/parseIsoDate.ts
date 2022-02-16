export default function toGoogleCalDate(d:any){
    function pad(n:any){return n<10 ? '0'+n : n}
    const dateStr = d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
    return dateStr.replaceAll(':','').replaceAll('-','')
        }