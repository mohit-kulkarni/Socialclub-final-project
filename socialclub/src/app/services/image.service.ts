import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  generateImageLink(imageSource): any {
    return (imageSource = `http://localhost:8000${imageSource}`);
  }
}
