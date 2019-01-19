export default interface IParser<T> {
    parse(html: string): T;
}