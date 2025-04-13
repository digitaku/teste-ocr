import { OcrService } from './../services/ocr.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(public readonly ocrService:OcrService ) {}

  text: string = ''

  async toggleOcr() {
    console.log('Recognizing image...');
    this.ocrService.imagemCortada = null
    const text = await this.ocrService.recognizeImage();
    this.text = text;
  }
}
