import { Request, Response } from '../../../../interfaces/express';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import mongoose from 'mongoose';

export class DeletionQueryCheckRequest implements MiddlewareContract {

  constructor() {

  }

  async use(req: Request, response: Response, next: Function) {
    const { id } = req.query;
    if (!this.idValidate(id)) {
      next(new Error('id for deletion is not valid'));
    }
    next();
  }

  private idValidate(id: string) {
    const ObjectId = mongoose.Types.ObjectId;
    if (ObjectId.isValid(id)) {
      if((String)(new ObjectId(id)) == id) {
        return true;
      }
      return false;
    }
    return false;
  }
}