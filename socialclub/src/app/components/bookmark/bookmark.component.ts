import { Component, Input, OnInit } from '@angular/core';
import { BookmarkService } from '../../services/bookmark.service';
import { Post } from '../../interfaces/post';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
})
export class BookmarkComponent implements OnInit {
  bookmarkedPosts: any[] = [];
  bookmarkedPostsDetails: any[] = [];
  reverseBookmarks;
  imgBaseUrl: string = 'http://127.0.0.1:8000/';
  img: string;

  constructor(
    private bookmarkService: BookmarkService,
    private postservice: PostService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    const userIdString = sessionStorage.getItem('userId');
    let userId = 24; // Default value or fallback user ID if not found in session storage
    if (userIdString) {
      userId = parseInt(userIdString, 10); // Convert the string to a number
    } else {
      console.error('No user ID found in session storage');
    }

    this.loadFavoriteMovies(userId);
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

  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }

  loadFavoriteMovies(userId: number): void {
    this.bookmarkService.getUserBookmarks(userId).subscribe({
      next: (bookmarks) => {
        const postDetailsRequests: Observable<any>[] = bookmarks.map(
          (bookmark) => this.postservice.getPostById(bookmark.post)
        );

        forkJoin(postDetailsRequests).subscribe({
          next: (postsDetails) => {
            this.bookmarkedPostsDetails = postsDetails;
            this.bookmarkedPostsDetails.reverse();

            this.bookmarkedPostsDetails.forEach((postDetail) => {
              const mediaUrl = this.imgBaseUrl + postDetail.image_or_video;
              postDetail.mediaType = this.getMediaType(
                postDetail.image_or_video
              );

              // Set the media URL and type in the post detail object
              postDetail.mediaUrl = mediaUrl;
              console.log(mediaUrl);
            });
          },
          error: (error) => {
            console.error('Error fetching post details:', error);
          },
        });
      },

      error: (error) => {
        console.error('Error fetching bookmarks:', error);
      },
    });

    // this.getUserBookmarks(userId).subscribe(res => {
    //   this.bookmarkedPosts = res;
    //   console.log(res);
    // })
  }
}
