import * as XLSX from 'xlsx';
import * as fs from 'fs'; 

const XLSUtil = {

    /**
     * 
     * @param filePath Path to file
     * @param sheetNames sheet names to read. If empty, reads the first sheet
     * @returns 
     */
    async readExcelFile (filePath: string, sheetName: string): Promise<any[] | undefined> {
        try {
            // Read the file content as a buffer. Sample: 
            const fileBuffer = fs.readFileSync(filePath);

            // Parse the workbook
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

            let data: string[] = [];
            // Get the worksheet
            if (!workbook.SheetNames.includes(sheetName)) {
                console.warn(`Sheet "${sheetName}" was not found in filePath "${filePath}"`);
            } else {
                const records = workbook.Sheets[sheetName]
                data = XLSX.utils.sheet_to_json(records, { raw: true });
            }
            
            // Checks for data not being empty, if so, read from first sheet as fallback
            if (data.length === 0) {
                console.warn(`No data found in the specified sheet "${sheetName}". Reading from first sheet as fallback.`);
                const firstSheetName = workbook.SheetNames[0];
                const firstWorksheet = workbook.Sheets[firstSheetName];
                data = XLSX.utils.sheet_to_json(firstWorksheet, { raw: true });
            }

            return data;

        } catch (err) {
            console.error("Error reading Excel file:", err);
            return undefined;
        }
    }
};

const TSDataIngestor = {

    ...XLSUtil,

    /**
     * Loads site data from the specified Excel workbook
     * @param filePath Path to the Excel file
     * @param sheetNames Defaults to ["National Accounts", "Local Sites"]. Change if Excel file uses different naming
     * @returns 
     */
    async loadSitesFromWorkbook(filePath: string, sheetNames: string[] = ["National Accounts", "Local Sites"]): Promise<{} | undefined> {
        let siteData: {} = {};
        let siteCategories: {}[] = [];
        for (const sheet in sheetNames) {
            const sheetName = sheetNames[sheet];
            siteData[sheetName] = await this.readExcelFile(filePath, sheetName);
        }
        
        const sapColumn = "SAP Ship To";
        const nameColumns = ['Treadstat Name', 'SiteName'];
        
        for(const key in siteData) {
            if (siteData[key] == undefined || !siteData[key].some((dict: any) => nameColumns[0] in dict) && !siteData[key].some((dict: any) => nameColumns[1] in dict)) {
                console.log(`Either Sheet data was not properly extracted from workbook or expected columns where NOT found. \nExpected columns are ${nameColumns}.\n Skipping sheet ${key}`);
            }
         
            siteCategories[key] = siteData[key].map((record: { [x: string]: any }) => `${record[nameColumns[0]] ?? record[nameColumns[1]]}${ record[sapColumn]==undefined ? '' : '++'+record[sapColumn]}`);
        }

        return siteCategories;
    },

    async loadDuplicatedMountsData(filePath: string, sheetName: string = 'Duplicate Mounts'): Promise<[] | undefined> {
        const sheetRecords = await this.readExcelFile(filePath, sheetName);
        const columns = ['VehicleNumber', 'TireNumber', 'MountingPositionCode'];
        
        if (sheetRecords == undefined || !sheetRecords.some((dict: any) => columns[0] in dict) || !sheetRecords.some((dict: any) => columns[1] in dict) || !sheetRecords.some((dict: any) => columns[2] in dict)) {
            throw new Error(`No data extracted from workbook our of missing column. Terminating filter creation process. Checked columns below: \n${columns}`);
        }

        // Creates a record with format "TireNumber|VehicleNumber"
        return sheetRecords.map((record: { [x: string]: any }) => `${record[columns[1]]}|${record[columns[0]]}`);
    },

    async loadMissingMountsData(filePath: string, sheetName: string = 'Missing Mounts'): Promise<{} | undefined> {
        const sheetRecords = await this.readExcelFile(filePath, sheetName);
        const columns = ['VehicleNumber', 'SecondaryId', 'MountedTires', 'AvailablePositions'];

        if (sheetRecords == undefined || !sheetRecords.some((dict: any) => columns[0] in dict) || !sheetRecords.some((dict: any) => columns[1] in dict) || !sheetRecords.some((dict: any) => columns[2] in dict)) {
            throw new Error(`No data extracted from workbook our of missing column. Terminating filter creation process. Checked columns below: \n${columns}`);
        }
        console.log(sheetRecords[100]);
        const missingMountsList = Object.fromEntries(
            sheetRecords
                .filter((record: any) => {
                    let vehicleNumber = record[columns[0]];
                    let mountedTires = Number(record[columns[2]]);

                    if (typeof vehicleNumber !== 'string') vehicleNumber = String(vehicleNumber ?? '');
                    if (vehicleNumber.toUpperCase() === 'NULL' || vehicleNumber === '') {
                        vehicleNumber = record[columns[1]];
                        if (typeof vehicleNumber !== 'string') vehicleNumber = String(vehicleNumber ?? '');
                    }
                    return vehicleNumber && vehicleNumber.toUpperCase() !== 'NULL' && mountedTires && mountedTires != 0;
                })
                .map((record: any) => {
                    let vehicleNumber = record[columns[0]];
                    let mountedTires = Number(record[columns[2]]);
                    let availablePositions = Number(record[columns[3]])
                    
                    if (typeof vehicleNumber !== 'string') vehicleNumber = String(vehicleNumber ?? '');
                    if (vehicleNumber.toUpperCase() === 'NULL' || vehicleNumber === '') {
                        vehicleNumber = record[columns[1]];
                        if (typeof vehicleNumber !== 'string') vehicleNumber = String(vehicleNumber ?? '');
                    }
                    return {
                        VehicleNumber: vehicleNumber, 
                        MountedTires: mountedTires,
                        AvailablePositions: availablePositions
                    };
                })
        );

        return missingMountsList;
    },

    /**
     * TODO: Refine this method's implementation
     * Converts position code from DB into UI display format
     * @param positionCode 
     */
    convertPositionCodeIntoUICode(positionCode: string) {
        const re_check = /^X\dY\d$/;

        if (!re_check.test(positionCode.toUpperCase())) {
            throw new Error(`Position code for Tire not complying with format: X{digit}Y{digit} for ${positionCode}`);
        }

        return `${positionCode[positionCode.length-1]}-${positionCode[1]}`
    },

    /**
     * Converts position code from DB into TreatStat display format
     * @param positionCode 
     */
    convertPositionCodeIntoTSposition(positionCode: string) {
        // TODO: Implement. Challenge: Anticipate to when X position is expected to have more than 2
        // e.g. Vehicle T219 (from Batch 113) having LRO (left roar outside) LRI RRO & RRI (right roar inside)
    },
    /*
    async loadTireDataFromToolboxReport(filePath: string): Promise<any[] | undefined> {

    }*/
};

export default TSDataIngestor;


