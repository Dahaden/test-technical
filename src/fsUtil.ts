import fs from 'fs/promises';
import { constants } from 'fs';
import { exec } from 'child_process';
import { format } from 'date-fns';


export const createDirectoryIfNotExists = async (path: string) => {
    try {
        await fs.access(path, constants.W_OK);
    } catch (error) {
        await fs.mkdir(path, { recursive: true });
    }
};

export const extractFilesIn = async (sourceDir: string) => {
    return new Promise((resolve, reject) => {
        exec(`gzip -d ${sourceDir}`, {}, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(void 0);
            }
        });
    });
};

export interface MergeFilesArgs {
    sourceDir: string,
    targetFile: string,
    startTime: Date,
    endTime: Date,
}

const TEQC_TIME_FORMAT = 'yyyyMMddhhmmss.SSSSS';

export const mergeFiles = async ({
    sourceDir,
    targetFile,
    startTime,
    endTime,
}: MergeFilesArgs) => {
    const startFormatted = format(startTime, TEQC_TIME_FORMAT);
    const endFormatted = format(endTime, TEQC_TIME_FORMAT);
    return new Promise((resolve, reject) => {
        exec(`teqc -st ${startFormatted} -e ${endFormatted} ${sourceDir}/* > ${targetFile}`, {}, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(void 0);
            }
        });
    });
};