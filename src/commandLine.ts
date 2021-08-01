import { downloadAndMergeRinexFiles } from './api';

const main = async () => {
    // 3rd arg is start of args when running from ts-node
    console.log(process.argv);
    // TODO check for appropriate number of args
    await downloadAndMergeRinexFiles({
        baseStationId: process.argv[2],
        startTimestamp: process.argv[3],
        endTimestamp: process.argv[4]
    });
};

(async () => {
    try {
        await main();
    } catch(error) {
        console.error('Could not complete program:', error);
        process.exit(1);
    }
})();