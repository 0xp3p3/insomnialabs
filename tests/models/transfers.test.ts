// Import the functions to test
import { readTransfers, readTopAccounts, readTotalVolume } from '../../src/models/model-transfer';
// Import required dependencies for mocking
import { getTransaction, commit, rollback } from '../../src/utils/dbUtil';
import { logger } from '../../src/utils/logger';
// Mocking the dependencies
jest.mock('../../src/utils/dbUtil');
jest.mock('../../src/utils/logger');

const mockReadData = [
    { id: 1, sender: '0xabc123', receiver: '0xdef456', amount: '100', timestamp: '2022-01-01 00:00:00' },
    { id: 2, sender: '0xabc123', receiver: '0xdef456', amount: '150', timestamp: '2022-02-01 00:00:00' },
    { id: 3, sender: '0xabc123', receiver: '0xdef456', amount: '200', timestamp: '2022-03-01 00:00:00' },
    { id: 4, sender: '0xabc123', receiver: '0xdef456', amount: '250', timestamp: '2022-04-01 00:00:00' },
    { id: 5, sender: '0xabc123', receiver: '0xdef456', amount: '300', timestamp: '2022-05-01 00:00:00' },
    { id: 6, sender: '0xabc123', receiver: '0xdef456', amount: '350', timestamp: '2022-06-01 00:00:00' },
    { id: 7, sender: '0xabc123', receiver: '0xdef456', amount: '400', timestamp: '2022-07-01 00:00:00' },
];

describe('Model-Transfer Tests', () => {
    let mockClient: { query: jest.Mock };

    beforeEach(() => {
        mockClient = { query: jest.fn() };
        (getTransaction as jest.Mock).mockResolvedValue(mockClient);

        // Reset mocks before each test
        jest.clearAllMocks();
    });

    describe('readTransfers', () => {
        it('should retrieve transfer data from the database', async () => {
            mockClient.query.mockResolvedValue({ rows: mockReadData });

            const result = await readTransfers('2022-01-01 00:00:00', '2022-05-01 00:00:00', 'amount', 'DESC', 10, 0);

            expect(getTransaction).toBeCalledTimes(1);
            expect(mockClient.query).toBeCalledWith(expect.stringContaining('SELECT * FROM transfers'));
            expect(commit).toBeCalledTimes(1);
            expect(result).toEqual(mockReadData);
        });

        it('should handle invalid timestamps', async () => {
            await expect(readTransfers('invalid-timestamp', '2023-12-31 23:59:59', 'amount', 'DESC', 10, 0)).rejects.toThrow('Invalid "from" timestamp format.');
            await expect(readTransfers('2023-01-01 00:00:00', 'invalid-timestamp', 'amount', 'DESC', 10, 0)).rejects.toThrow('Invalid "to" timestamp format.');
        });

        it('should handle errors', async () => {
            mockClient.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(readTransfers('2022-01-01 00:00:00', '2022-05-01 00:00:00', 'amount', 'DESC', 10, 0)).rejects.toThrow('Database error');

            expect(getTransaction).toBeCalledTimes(1);
            expect(rollback).toBeCalledTimes(1);
            expect(logger.error).toBeCalledWith('readTransfers error: Database error');
        });

        it('should handle empty results', async () => {
            mockClient.query.mockResolvedValueOnce({ rows: [] });

            const result = await readTransfers('2022-01-01 00:00:00', '2022-05-01 00:00:00', 'amount', 'DESC', 10, 0);

            expect(getTransaction).toBeCalledTimes(1);
            expect(commit).toBeCalledTimes(1);
            expect(result).toEqual([]);
        });
    });

    describe('readTopAccounts', () => {
        it('should retrieve top accounts by transfer volume', async () => {
            const mockTopAccountsData = [
                { address: '0xabc123', total_volume: '1000' },
                { address: '0xdef456', total_volume: '500' },
            ];
            mockClient.query.mockResolvedValue({ rows: mockTopAccountsData });

            const result = await readTopAccounts('2022-01-01 00:00:00', '2022-05-01 00:00:00', 10, 0);

            expect(getTransaction).toBeCalledTimes(1);
            expect(mockClient.query).toBeCalledWith(expect.stringContaining('SELECT address, SUM(CAST(amount AS numeric)) AS total_volume'));
            expect(commit).toBeCalledTimes(1);
            expect(result).toEqual(mockTopAccountsData);
        });

        it('should handle invalid timestamps', async () => {
            await expect(readTopAccounts('invalid-timestamp', '2023-12-31 23:59:59', 10, 0)).rejects.toThrow('Invalid "from" timestamp format.');
            await expect(readTopAccounts('2023-01-01 00:00:00', 'invalid-timestamp', 10, 0)).rejects.toThrow('Invalid "to" timestamp format.');
        });

        it('should handle errors', async () => {
            mockClient.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(readTopAccounts('2022-01-01 00:00:00', '2022-05-01 00:00:00', 10, 0)).rejects.toThrow('Database error');

            expect(getTransaction).toBeCalledTimes(1);
            expect(rollback).toBeCalledTimes(1);
            expect(logger.error).toBeCalledWith('readTopAccountsByVolume error: Database error');
        });

        it('should handle empty results', async () => {
            mockClient.query.mockResolvedValueOnce({ rows: [] });

            const result = await readTopAccounts('2022-01-01 00:00:00', '2022-05-01 00:00:00', 10, 0);

            expect(getTransaction).toBeCalledTimes(1);
            expect(commit).toBeCalledTimes(1);
            expect(result).toEqual([]);
        });
    });

    describe('readTotalVolume', () => {
        it('should retrieve total transferred volume', async () => {
            const mockTotalVolumeData = [{ total_amount: '2000' }];
            mockClient.query.mockResolvedValue({ rows: mockTotalVolumeData });

            const result = await readTotalVolume();

            expect(getTransaction).toBeCalledTimes(1);
            expect(mockClient.query).toBeCalledWith(expect.stringContaining('SELECT SUM(CAST(amount AS numeric)) AS total_amount'));
            expect(commit).toBeCalledTimes(1);
            expect(result).toEqual(mockTotalVolumeData);
        });

        it('should handle errors', async () => {
            mockClient.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(readTotalVolume()).rejects.toThrow('Database error');

            expect(getTransaction).toBeCalledTimes(1);
            expect(rollback).toBeCalledTimes(1);
            expect(logger.error).toBeCalledWith('readTransfers error: Database error');
        });
    });
});
