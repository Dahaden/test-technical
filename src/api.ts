import {
    addHours,
    endOfHour,
    fromUnixTime,
    getDayOfYear,
    getTime,
    getYear,
    isBefore,
    isEqual,
    parseISO,
    startOfHour,
} from 'date-fns';

import { DownloadAndMergeArg } from './types';
import {
    createUrlForFile,
    downloadFiles,
    FileToUrlArgs, getHourBlockForDate,
} from './ftpUtil';
import {
    createDirectoryIfNotExists
} from './fsUtil';

const TEMPORARY_DOWNLOAD_FILE = './temp_data_dir';
const FTP_DOMAIN = 'geodesy.noaa.gov';
const FTP_BASE_PATH = '/corsdata/rinex';

export const downloadAndMergeRinexFiles = async (options: DownloadAndMergeArg) => {
    const startDate = startOfHour(parseISO(options.startTimestamp));
    const endDate = endOfHour(parseISO(options.endTimestamp));

    let currentDate = startDate;
    const filesToDownload: string[] = [];
    console.log('Start and End times', startDate, endDate);

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
        const pathArgs: FileToUrlArgs = {
            basePath: FTP_BASE_PATH,
            baseStationId: options.baseStationId,
            year: getYear(currentDate),
            dayOfYear: getDayOfYear(currentDate),
            hourBlock: getHourBlockForDate(currentDate),
        };
        filesToDownload.push(createUrlForFile(pathArgs));
        currentDate = addHours(currentDate, 1);
    }
    await createDirectoryIfNotExists(TEMPORARY_DOWNLOAD_FILE);
    await downloadFiles({
        domain: FTP_DOMAIN,
        filePaths: filesToDownload,
        outputDir: TEMPORARY_DOWNLOAD_FILE,
    });

};