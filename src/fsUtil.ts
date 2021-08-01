import fs from 'fs/promises';
import { constants } from 'fs';

export const createDirectoryIfNotExists = async (path: string) => {
    try {
        await fs.access(path, constants.W_OK);
    } catch (error) {
        await fs.mkdir(path, { recursive: true });
    }
};

export const deleteFilesInDir = async (path: string) => {
    try {
        // await fs.rmdir
    } catch(error) {

    } 
};

export const deleteDirectory = async (path: string) => {
    try {
        // await fs.rmdir
    } catch(error) {

    }
};