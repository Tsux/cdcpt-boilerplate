import { exec } from 'child_process';

const FileHandler = {

    addTestFolder(testName: string): string{
        const now = new Date().valueOf();
        const testFolder = `${testName}Report_${now}`;
        const command = `mkdir output/${testFolder}`;
        exec(command, (err, stdout, stderr) => {
            console.log(err, stdout, stderr);
        });

        return testFolder;
    },

    /**
     * Moves latest downloaded report of type provided for Site. Renames file based on Site with format {site}_{reportType}_{timestamp}.xls
     * Note: This method assumes all reports come in Excel (xlsx extension) format. Returns created file name
     * @param reportType Report type (e.g. In Stock, On Vehicle, Scrapped)
     * @param siteName
     */
    ingestDownloadedReportForSiteIntoOutput(reportType: string, siteName: string, testFolder: string): string {
        const now = new Date().valueOf();
        const newFileName = `${siteName}_${reportType.replace(/ /g, "")}_${now}.xlsx`;
        const command = `mv /Users/tsunemaldonadomatias/Downloads/${reportType}.xlsx output/${testFolder}/${newFileName}`;
        
        console.log(`Moving ${newFileName} to output/`)
        exec(command, (err, stdout, stderr) => {
            console.log(err, stdout, stderr);
        });

        return newFileName;
    }


};

export default FileHandler;