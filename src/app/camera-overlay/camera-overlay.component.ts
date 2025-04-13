import { Component } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import {CameraPreview, CameraPreviewOptions} from "@capacitor-community/camera-preview";
import {NgIf} from "@angular/common";
import {Capacitor} from "@capacitor/core";
import {NavController} from "@ionic/angular";
import {OcrService} from "../services/ocr.service";
import {Photo} from "@capacitor/camera";

@Component({
  selector: 'app-camera-overlay',
  templateUrl: './camera-overlay.component.html',
  styleUrls: ['./camera-overlay.component.scss'],
  imports: [
    IonContent,
    IonButton,
    IonSpinner,
    NgIf,
    IonCard,
    IonCardContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  standalone: true
})
export class CameraOverlayComponent{
  cameraProp: CameraPreviewOptions = {
    parent: 'cameraPreview',
    toBack: true,
    position: 'rear',
    disableAudio: true,
    enableZoom: true
  }

  isCameraReady: boolean = false;
  isProcessing: boolean = false;
  constructor(private readonly navController: NavController, private ocrService: OcrService) { }

  async startCamera() {
    await CameraPreview.start(this.cameraProp);
  }

  ionViewDidEnter() {
    if (Capacitor.getPlatform() === "web") {
      this.isCameraReady = true
      return
    }
    this.startCamera().then(() => this.isCameraReady = true);
  }

  ionViewDidLeave() {
    this.closeModal().then();
  }

  async captureImage() {
    try {
      this.isProcessing = true;
      const imgPrefix = 'data:image/jpeg;base64,'
      const result = await CameraPreview.captureSample({});
      const base64PictureData = imgPrefix+result.value;
      const imageCroped = await this.cropImageForOCR(base64PictureData);

      this.ocrService.imagemCortada = imgPrefix+imageCroped;
      this.ocrService.imagemOriginal = base64PictureData;
      await this.ocrService.recognizeImage()
    } catch (e: any) {
      this.ocrService.err = e
    }finally {
      this.isProcessing = false
      await this.closeModal()
    }


  }

  async closeModal() {
    console.log("sairndo")
    await CameraPreview.stop();
    this.navController.back()
  }

  private cropImageForOCR(fullImageDataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = fullImageDataUrl;
      img.onload = () => {
        const cropCanvas = document.createElement('canvas');
        const ctx = cropCanvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Erro ao criar contexto do canvas para crop.'));
          return;
        }

        const cropWidth = img.width * 0.8;
        const cropHeight = img.height * 0.15;
        const cropX = (img.width - cropWidth) / 2;
        const cropY = (img.height - cropHeight) / 2;

        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
        const croppedDataUrl = cropCanvas.toDataURL('image/jpeg');
        resolve(croppedDataUrl.split(',')[1]);
      };
      img.onerror = () => {
        reject(new Error('Erro ao cortar imagem'));
      };
    });
  }

  private async savePicture(photo: Photo) { }
}
