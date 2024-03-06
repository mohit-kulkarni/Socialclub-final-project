import { Component, Input, OnInit } from '@angular/core';
// import no_user from '../../../../assets'

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss',
})
export class postImageComponent implements OnInit {
  @Input() imageSource!: string;
  mediaLink: string;
  mediaType: string;

  constructor() {}

  ngOnInit(): void {
    this.mediaLink = this.generateImageLink();
    this.mediaType = this.getMediaType(this.mediaLink);
  }
  generateImageLink(): string {
    // return `http://localhost:8000${this.imageSource}`;
    return `${this.imageSource}`;
  }

  getMediaType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png' ||
      extension === 'gif'
    ) {
      return 'image';
    } else if (
      extension === 'mp4' ||
      extension === 'mov' ||
      extension === 'avi'
    ) {
      return 'video';
    } else if (
      extension === 'mp3' ||
      extension === 'wav' ||
      extension === 'ogg'
    ) {
      return 'audio';
    } else {
      return 'unknown';
    }
  }

  // generateImageLink() {
  //   this.imageService.generateImageLink(this.imageSource).subscribe({
  //     next: (data) => {
  //       this.imageLink = data;
  //       console.log(this.imageLink);
  //     },
  //     error: (error) => {
  //       console.log(`Error fetching image link setting default image`);
  //       this.imageLink = '../../../../assets/img/no_user.jpg';
  //     },
  //   });
  // }
}
