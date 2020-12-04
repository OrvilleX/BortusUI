declare module 'jsencrypt';

/**
 * 扩展原生Date对象
 */
interface Date {
    toMidnight: () => Date;
    daysAgo: (days: number, midnight: boolean) => Date;
    monthBegin: (offset: number) => Date;
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