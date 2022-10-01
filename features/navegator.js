export default class Navegator {
    static getOffset(page, limit) {
        return (+page - 1) * limit;
    }
    static getPages(records, limit) {
        return Math.ceil(+records / limit);
    }
    static getNumberParam(value) {
        if (value == undefined) {
            return 1;
        }
        return +value;
    }
}
