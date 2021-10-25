const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays() {
    // Discard the time and time-zone information.
    const a = new Date(document.getElementById('start__date').value)
    const b = new Date(document.getElementById('end__date').value)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const dateDeff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return dateDeff
}
export { dateDiffInDays }