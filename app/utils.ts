function formatDate(dateString:string):string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Add 1 because getMonth() returns a zero-based index
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${day}/${month}/${year}`;
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${(minutes < 10 ? '0' : '') + minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
    return formattedDateTime
}


export { formatDate }