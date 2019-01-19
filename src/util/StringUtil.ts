export default abstract class StringUtil {
    static joinUrl(...pieces: string[]): string {
        return pieces.join('/').replace(/\/\//g, '/');
    }
}