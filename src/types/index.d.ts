declare module 'jsencrypt';
declare module 'vue-count-to';
declare module '*.png';
declare module '*.jpg';
declare module '@riophae/vue-treeselect';
declare module 'vue-image-crop-upload';
declare module "vue-highlightjs";
declare module '*.gif' {
    export const gif: any
}

/**
 * 扩展原生Date对象
 */
interface Date {
    toMidnight: () => Date;
    daysAgo: (days: number, midnight?: boolean) => Date;
    monthBegin: (offset: number = 0) => Date;
    quarterBegin: () => Date;
    yearBegin: () => Date;
    strftime: (format: string, local: string) => string;
    getDaysOfYear: () => number;
    getWeeksOfYear: (start: boolean) => number;
    humanize: (local: string) => string;
    toNow: () => Date;
}

interface DateConstructor {
    today: () => number;
}