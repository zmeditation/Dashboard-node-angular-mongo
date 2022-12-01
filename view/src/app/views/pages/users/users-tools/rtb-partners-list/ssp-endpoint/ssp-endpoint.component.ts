import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from "moment";

@Component({
  selector: 'app-ssp-endpoint',
  templateUrl: './ssp-endpoint.component.html',
  styleUrls: ['./ssp-endpoint.component.scss']
})
export class SspEndpointComponent implements OnInit {

  public USEndpoint: string;

  public EUEndpoint: string;

  public statsEndpoint: string;

  public dates: { now: string, threeDaysBefore: string } = {
    now: moment().format('YYYY-MM-DD'),
    threeDaysBefore: moment().subtract(3, 'days').format('YYYY-MM-DD')
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public token: string
  ) {
  }

  ngOnInit(): void {
    this.getEndpoints(this.token);
  }

  getEndpoints(token: string): void {
    this.USEndpoint = `https://us.rtb.adwmg.com/rtb?sk=${ token }`;
    this.EUEndpoint = `https://rtb.adwmg.com/rtb?sk=${ token }`;
    this.statsEndpoint = `https://api.rtb.adwmg.com/api?sk=${ token }&from=${ this.dates.threeDaysBefore }&to=${ this.dates.now }`
  }

}
