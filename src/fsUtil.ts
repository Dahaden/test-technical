import fs from 'fs/promises';
import { constants } from 'fs';
import { exec } from 'child_process';

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

export const mergeFiles = async (sourceDir: string, targetFile: string) => {
    return new Promise((resolve, reject) => {
        exec(`teqc ${sourceDir}/* > ${targetFile}`, {}, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(void 0);
            }
        });
    });
};