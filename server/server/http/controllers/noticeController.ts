import { NoticeService } from 'services/notice';
import { Request, Response } from 'interfaces/express';

export class NoticeController {

  constructor(private service: NoticeService) {

  }

  async getNotice(request: Request, response: Response) {
    let result = {
      data: null
    };
    let statusCode = 200;
    const { query } = request.body;

    try {
      result.data = await this.service.getNotice(query);
    } catch (e: any) {
      statusCode = e.statusCode;
    }

    response.status(statusCode).json(result);
  }

  async getList(request: Request, response: Response) {
    const result = {
      data: null
    };
    let statusCode = 200;

    try {
      result.data = await this.service.getList();
    } catch (e: any) {
      statusCode = e.statusCode;
    }

    response.status(statusCode).json(result);
  }

  async create(request: Request, response: Response) {
    let result;
    let statusCode = 200;
    const { query } = request.body;

    try {
      result = await this.service.createNotice(query);
    } catch (e: any) {
      statusCode = e.statusCode;
      result = e;
    }

    response.status(statusCode).json(result);
  }

  async delete(request: Request, response: Response) {
    let result;
    let statusCode = 200;
    const { query } = request;

    try {
      result = await this.service.deleteNotice(query);
    } catch (e: any) {
      statusCode = e.statusCode;
      result = e;
    }

    response.status(statusCode).json(result);
  }
};
