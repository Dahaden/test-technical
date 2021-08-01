import {
    createUrlForFile,
    createFilePathsFor,
    getHourBlockForDate,
    localTimeToUTC,
} from '../ftpUtil';
describe('FTPUtil', () => {

    describe('getHourBlockForDate', () => {

        // * a refers to the hour from 12am-1am (GPS time),
        it('should return a for 12 am', () => {
            const now = new Date();
            now.setHours(0);
            const actual = getHourBlockForDate(now);
            expect(actual).toBe('a');
        });

        // * x refers to 11pm-12am, and so on
        it('should return x for 11 pm', () => {
            const now = new Date();
            now.setHours(23);
            const actual = getHourBlockForDate(now);
            expect(actual).toBe('x');
        });
    });

    describe('createUrlForFile', () => {
        it('should return correctly formmated url', () => {
            const expected = '/corsdata/rinex/2021/206/nybp/nybp206b.21o.gz';
            
            const actual = createUrlForFile({
                basePath: '/corsdata/rinex',
                year: 2021,
                dayOfYear: 206,
                baseStationId: 'nybp',
                hourBlock: 'b'
            });
            expect(actual).toBe(expected);
        });
    });

    describe('createFilePathsFor', () => {
        test('should create paths for each hour block between times', () => {
            const expected: string[] = [
                '/corsdata/rinex/2021/206/nybp/nybp206x.21o.gz',
                '/corsdata/rinex/2021/207/nybp/nybp207a.21o.gz',
                '/corsdata/rinex/2021/207/nybp/nybp207b.21o.gz'
            ];

            const actual = createFilePathsFor({
                baseStationId: 'nybp',
                basePath: '/corsdata/rinex',
                startDate: localTimeToUTC('2021-07-25T23:11:22Z'),
                endDate: localTimeToUTC('2021-07-26T01:33:44Z'),
            });

            expect(actual).toEqual(expected);
        });
    });
});