import { AfterViewInit, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EditDialogData } from "../../services/models";
import { RXBox } from "rxbox";

@Component({
  selector: 'app-analytics-adapter-settings-dialog-component',
  templateUrl: './analytics-adapter-settings-dialog-component.html',
  styleUrls: ['./analytics-adapter-settings-dialog-component.scss']
})
export class AnalyticsAdapterSettingsDialogComponent implements AfterViewInit {
  dashboardId: string = this.store.getState().dashboardId;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EditDialogData,
    private cd: ChangeDetectorRef,
    private store: RXBox
  ) {}

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  getDataFromInput(form: HTMLFormElement) {
    const elements: Array<Element> = Array.from(form.elements);
    const res = [];
    elements.forEach((el: HTMLInputElement) => {
      res.push({ [el.name]: el.value });
    });
    return { [form.name]: res };
  }

  checkFormValidity(form: HTMLFormElement): boolean {
    return !form.checkValidity();
  }
}
