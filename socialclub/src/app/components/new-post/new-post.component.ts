// new-post.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NewPostService } from '../../services/new-post.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements AfterViewInit {
  username: string = sessionStorage.getItem('username') || ''; // Change this to the actual user ID
  caption: string;
  location: string;
  mediaFiles: File[] = [];
  mediaPreviews: { url: SafeUrl; type: string }[] = [];
  errorMessage: string = '';
  isOpen: boolean = false;

  @ViewChild('newPostContainer') newPostContainer: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private newPostService: NewPostService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.showModal();
  }

  showModal() {
    this.zone.run(() => {
      if (this.isOpen) {
        this.newPostContainer.nativeElement.classList.remove(
          'new-post-modal-open'
        );
        this.isOpen = false;
      } else {
        this.newPostContainer.nativeElement.classList.add(
          'new-post-modal-open'
        );
        this.isOpen = true;
      }
    });
  }

  onFilesSelected(event: any): void {
    const files: FileList | null = event.target.files;
    if (files) {
      this.mediaFiles = Array.from(files);
      this.mediaPreviews = this.mediaFiles.map((file) => {
        const url = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
        const type = this.getMediaType(file.name);
        return { url, type };
      });
    }
  }

  getMediaType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png' ||
      extension === 'gif'
    ) {
      return 'image';
    } else if (extension === 'mp4' || extension === 'mov') {
      return 'video';
    } else if (extension === 'mp3' || extension === 'wav') {
      return 'audio';
    } else {
      return 'unknown';
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('caption', this.caption);
    formData.append('location', this.location); // Add location if needed

    // Append each file to the form data
    this.mediaFiles.forEach((file) => {
      formData.append('image_or_video', file, file.name);
    });

    // alert(`Added a new shout successfully!!`);
    // this.router.navigate(['/home']);

    console.log('Submitting FormData:', formData);
    console.log(this.location);

    // Call the service to send the data to the Django backend
    // Display confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this post?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the service to send the data to the Django backend
        this.newPostService.postData(formData).subscribe(
          (response) => {
            console.log(response.message);
            Swal.fire({
              title: 'Success!',
              text: 'Post created successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            // Reset form fields on successful submission if needed
            this.caption = '';
            this.location = '';
            this.mediaFiles = [];
            this.mediaPreviews = [];
          },
          (error) => {
            console.error(error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add post. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            this.errorMessage = 'Failed to add post. Please try again.';
          }
        );
      }
    });
  }
}
