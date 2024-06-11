import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {
  readTransfers, readTotalVolume, readTopAccounts
} from "../models/model-transfer";

/**
 * Controller to handle GET requests for transfers
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getTotalVolume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await readTotalVolume();
    res.status(200).json({
      status: "ok",
      data: result,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error(`getTotalVolume error: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: error.message,
      statusCode: 500,
    });
  }
}
export const getTransfers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const sort = req.query.sort as string;
    const direction = req.query.direction as string;
    const limit = parseInt(req.query.limit as string);
    const offset = parseInt(req.query.offset as string);
    const result = await readTransfers(from, to, sort, direction, limit, offset);
    res.status(200).json({
      status: "ok",
      data: result,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error(`getTransfers error: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: error.message,
      statusCode: 500,
    });
  }
};

export const getTopAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const limit = parseInt(req.query.limit as string);
    const offset = parseInt(req.query.offset as string);
    const result = await readTopAccounts(from, to , limit, offset);
    res.status(200).json({
      status: "ok",
      data: result,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error(`getTopAccounts error: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: error.message,
      statusCode: 500,
    });
  }
};
