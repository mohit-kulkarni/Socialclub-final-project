import { Component } from '@angular/core';

@Component({
  selector: 'app-stories-new',
  templateUrl: './stories-new.component.html',
  styleUrl: './stories-new.component.scss',
})
export class StoriesNewComponent {
  mediaFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onMediaChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.mediaFile = files[0];

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.mediaFile);
    }
  }
}
