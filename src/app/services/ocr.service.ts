import { Injectable } from '@angular/core';
import { TextDetections, Ocr } from '@capacitor-community/image-to-text';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  imagemOriginal: string | null = null
  imagemCortada: string | null = null
  err: string = ""
  text: string = ""
  constructor() { }

  async recognizeImage(): Promise<string> {
    if(Capacitor.getPlatform() === 'web') {
      return 'This feature is not available on the web';
    }
    let imgPath = "";
    if (!this.imagemCortada) {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      imgPath = photo.path!
      this.text = imgPath
    }


    if (this.imagemCortada) imgPath = this.imagemCortada
    const data: TextDetections = await Ocr.detectText(this.imagemCortada ? { base64: imgPath } : { filename: imgPath });
    let a = '';
    for (let detection of data.textDetections) {
      a += detection.text;
    }
    this.text = a
    return a;
  }
}
