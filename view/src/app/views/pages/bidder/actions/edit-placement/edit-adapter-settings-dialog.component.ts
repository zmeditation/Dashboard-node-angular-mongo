import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EditDialogData } from "../../services/models";

@Component({
  selector: 'app-edit-adapter-settings-dialog-component',
  templateUrl: './edit-adapter-settings-dialog-component.html',
  styleUrls: ['./edit-adapter-settings-dialog-component.scss']
})
export class EditAdapterSettingsDialogComponent implements OnInit {
  disabled: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EditDialogData
  ) {}

  ngOnInit(): void {
    this.data.adapter.settings.forEach((setting: any) => {
      if (setting[0] === 'disabled') { this.disabled = setting[1].data; } else { this.disabled = false; }
      
    });
  }
}
