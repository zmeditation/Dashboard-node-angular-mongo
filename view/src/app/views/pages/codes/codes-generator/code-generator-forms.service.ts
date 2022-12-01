import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CodesGeneratorFormService {
  public mainForm = new FormGroup({
    code_type: new FormControl(''),
    publisher: new FormControl({ value: '', disabled: true }),
    is_new_adUnit: new FormControl(''),
    is_fluid: new FormControl('')
  });

  public GPTCodesGenForm = new FormGroup({
    network_id: new FormControl({ value: '112081842', disabled: true }, [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(/^[0-9]{6,50}$/)
    ]),
    child_network_id: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(/^[0-9]{6,50}$/)
    ]),
    placement_id: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(/^[\dA-z_\-.]{6,50}$/)
    ]),
    page_url: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^(https?:\/\/)([\w.-]+)\.([a-z]{2,7}\.?)(\/[\w.]*)*\/?$/)
    ]),
    slot_element_id: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(/^[\dA-z_\-]{6,50}$/)
    ]),
    pub_id: new FormControl('', [Validators.required]),
    fluid_height: new FormControl('', [Validators.max(250)]),
    ad_type: new FormControl('banner', [Validators.required]),
    sizes: new FormControl('', [Validators.required]),
    collapse_empty_divs: new FormControl(true),
    centered: new FormControl(false),
    analytics: new FormControl({ value: true, disabled: true }),
    logo: new FormControl(true),
    pm: new FormControl(true)
  });

  public fluidSettings = new FormGroup({
    position: new FormControl(''),
    closeButton: new FormControl(false),
    background: new FormControl(false)
  });
}
