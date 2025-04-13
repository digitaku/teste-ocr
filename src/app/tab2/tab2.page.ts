import { Component } from '@angular/core';
import {ModalController, ModalOptions, NavController} from "@ionic/angular";

import {CameraPreview} from "@capacitor-community/camera-preview";
import {OcrService} from "../services/ocr.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  isStarted: boolean = false
  constructor(private readonly navController: NavController, public ocrService: OcrService) {
  }
  async iniciarCamera() {

    this.navController.navigateForward('/camera-ocr')
  }

}
