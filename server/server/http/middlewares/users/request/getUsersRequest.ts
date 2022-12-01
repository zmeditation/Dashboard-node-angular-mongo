import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { QUERY_FIELDS_PARAM_KEYS } from '../../../../constants/users';
import { ROLES_ARR as ROLES } from '../../../../constants/roles';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class GetUsersRequest implements MiddlewareContract {
  private validationFields = {
    roles: 'roles',
    search: 'search',
    page: 'page',
    limit: 'limit',
    step: 'step',
    noRef: 'noRef',
    sort: 'sort',
    include: 'include',
    indent: 'indent',
    fields: 'fields'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    let { roles, search, page, limit, step, sort, include, indent, fields } = request.query;

    if (roles) {
      if (!Validator.hasValuesInArray(roles.split(','), ROLES)) {
        errors.push(this.validationFields.roles);
      } else {
        request.query.roles = roles.split(',');
      }
    }

    if (search) {
      search = JSON.parse(search);

      if (!Validator.min(search.value, 1) || !Validator.max(search.value, 50)) {
        errors.push(this.validationFields.search);
      } else {
        request.query.search = search;
      }
    }

    if (sort && !Validator.sort(sort)) {
      errors.push(this.validationFields.sort);
    }

    if (page) {
      if (!Validator.isNumber(page)) {
        errors.push(this.validationFields.page);
      } else {
        request.query.page = parseFloat(page);
      }
    }

    if (limit) {
      if (!Validator.isNumber(limit)) {
        errors.push(this.validationFields.limit);
      } else {
        request.query.limit = parseFloat(limit);
      }
    }

    if (step) {
      if (!Validator.isNumber(step)) {
        errors.push(this.validationFields.step);
      } else {
        request.query.step = parseFloat(step);
      }
    }

    if (include) {
      if (!Validator.includeGetParameter(include)) {
        errors.push(this.validationFields.include);
      } else {
        request.query.include = JSON.parse(include);
      }
    }

    if (indent) {
      if (!Validator.isNumber(indent)) {
        errors.push(this.validationFields.include);
      } else {
        request.query.indent = parseFloat(indent);
      }
    }

    if (fields) {
      if (!Validator.hasValuesInArray(fields.split(','), QUERY_FIELDS_PARAM_KEYS)) {
        errors.push(this.validationFields.fields);
      } else {
        request.query.fields = fields.split(',');
      }
    }

    if (errors.length) {
      return response.status(ERROR_CODES.VALIDATION_FAIL).send(
        JSON.stringify({
          status: ERROR_CODES.VALIDATION_FAIL,
          error: {
            message: ERRORS.VALIDATION_FAIL,
            fields: errors
          }
        })
      );
    }

    next();
  }
}
