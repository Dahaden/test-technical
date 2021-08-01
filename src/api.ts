import { parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { DownloadAndMergeArg } from './types';
import {
    createFilePathsFor,
    downloadFiles,
    localTimeToUTC,
} from './ftpUtil';
import {
    createDirectoryIfNotExists,
    extractFilesIn,
    mergeFiles,
} from './fsUtil';

const TEMPORARY_DATA_FILE = './temp_data_dir';
const FTP_DOMAIN = 'geodesy.noaa.gov';
const FTP_BASE_PATH = '/corsdata/rinex';

export const downloadAndMergeRinexFiles = async (options: DownloadAndMergeArg) => {
    const startDate = localTimeToUTC(options.startTimestamp);
    const endDate = localTimeToUTC(options.endTimestamp);

    const filesToDownload = createFilePathsFor({
        basePath: FTP_BASE_PATH,
        baseStationId: options.baseStationId,
        startDate,
        endDate,
    });

    await createDirectoryIfNotExists(TEMPORARY_DATA_FILE);

    console.log(`Downloading ${filesToDownload.length} Rinex files`);
    await downloadFiles({
        domain: FTP_DOMAIN,
        filePaths: filesToDownload,
        outputDir: TEMPORARY_DATA_FILE,
    });

    console.log('Unzipping Rinex files');
    await extractFilesIn(`${TEMPORARY_DATA_FILE}/*`);

    console.log('Merging Rinex files');
    await mergeFiles({
        sourceDir: TEMPORARY_DATA_FILE,
        targetFile: 'output.21g',
        startTime: startDate,
        endTime: endDate,
    });

    // Should then delete files and directory TEMPORARY_DATA_FILE
};