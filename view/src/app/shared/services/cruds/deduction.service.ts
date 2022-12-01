import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Deduction } from '../../interfaces/reporting.interface';
import { CommonResponse } from '../../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class DeductionService {

	private _deductionSum: string;

	set setDeductionSum(deduction: string) {
	  this._deductionSum = deduction;
	}

	get deductionSum(): string {
	  return this._deductionSum;
	}

	constructor(
		private http: HttpClient
	) {}

	geAllDeductions(): Observable<any> {
	  return this.http.get(environment.apiURL + '/deductions/get-all-deduction');
	}

	getPublisherDeductions(query): Observable<any> {
	  return this.http.get(environment.apiURL + `/deductions/get-deductions`, {
	    params: { query: JSON.stringify(query)}
	  });
	}

	addDeductionToPub(query): Observable<any> {
	  return this.http.post(environment.apiURL + '/deductions/add-deduction', {
	    query
	  });
	}

	bulkAddDeduction(
	  publisherId: string,
	  date: Date | string,
	  deductions: Deduction[],
	): Observable<CommonResponse> {
	  const url = environment.apiURL + '/deductions/bulk-add-deduction';
	  const query = { publisherId, date, deductions };

	  return this.http.post<CommonResponse>(url, { query });
	}
}
