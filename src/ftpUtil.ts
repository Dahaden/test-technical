import { getHours } from 'date-fns';
import https from 'https';
import fs from 'fs';

// Not actually using FTP, but had issues connecting to the FTP server and saw a notice
// saying public FTP access will be removed soon.
// >  The anonymous ftp service at ftp://geodesy.noaa.gov/cors/ is going away
//    on August 16, 2021. Users will have to use https or AWS BDP. 

// Not sure why it failed for me but https is said to work

const downloadFile = (url: string, outputPath: string): Promise<void> => {
    const splitPath = url.split('/');
    const fileName = splitPath[splitPath.length - 1];
    // Wont work if we get data for over 100 years but that should be fine :P
    const filePath = `${outputPath}/${fileName}`;
    console.log(`Downloading ${url} to ${filePath}`);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
    
        const request = https.get(url, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            return;
          }
    
          response.pipe(file);
        });
    
        file.on('finish', () => resolve());
    
        request.on('error', err => {
          fs.unlink(filePath, () => reject(err));
        });
    
        file.on('error', err => {
          fs.unlink(filePath, () => reject(err));
        });
    
        request.end();
    });
};

export interface DownloadFilesArgs {
    domain: string,
    filePaths: string[],
    outputDir: string,
};

export const downloadFiles = async (options: DownloadFilesArgs) => {
    try {
        const proimises = options.filePaths.map(
            path => downloadFile(`https://${options.domain}${path}`, options.outputDir)
        );
        return await Promise.all(proimises);
    } catch (error) {
        console.error('Failed to download files from server:', error);
        throw error;
    }
};

export interface FileToUrlArgs {
    basePath: string,
    year: number,
    dayOfYear: number,
    baseStationId: string,
    hourBlock: string,
}

/**
 * Construct url that looks like
 * https://geodesy.noaa.gov/corsdata/rinex/2021/206/nybp/nybp206b.21o.gz
 * Where:
 *   2021 is the year
 *   206 is the day of the year
 *   nybp is the base station ID
 *   b refers to the hour block. a refers to the hour from 12am-1am (GPS time), x refers to 11pm-12am, and so on
 *   The “21” in the .21o extension is the year again. Files from 2012 will end with .22o
 *
 * @param pathArgs typescript defined object with all args to make a valid path
 * @returns string of path to FTP file
 */
export const createUrlForFile = (pathArgs: FileToUrlArgs) => {
    const {
        basePath,
        year,
        dayOfYear,
        baseStationId,
        hourBlock,
    } = pathArgs;
    return `${basePath}/${year}/${dayOfYear}/${baseStationId}/` +
    `${baseStationId}${dayOfYear}${hourBlock}.${year.toString().slice(-2)}o.gz`;
};

/**
 * b refers to the hour block.
 * a refers to the hour from 12am-1am (GPS time),
 * x refers to 11pm-12am, and so on
 * @param date 
 */
export const getHourBlockForDate = (date: Date): string => {
    const hour = getHours(date);
    // Converts hour to letter of alphabet using base 36 (all letters + single digit numnbers)
    return (hour + 9).toString(36);
};