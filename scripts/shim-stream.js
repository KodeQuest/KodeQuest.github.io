// Pengganti minimal modul Node "stream": tidak ada aliran di browser, jadi `instanceof Stream` selalu false.
export class Stream {}
export default { Stream };
