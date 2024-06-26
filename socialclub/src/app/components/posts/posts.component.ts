import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../interfaces/post';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class postsComponent implements OnInit {
  posts: Post[];
  error: string | null = null;
  userOfPosts: User;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  isRotated: boolean = false;

  toggleRotation() {
    this.isRotated = !this.isRotated;
    // console.log(`Rotate: ${this.isRotated}`);
    setInterval(() => {
      this.isRotated = false;
    }, 3000);
  }
  

  fetchData() {
    this.apiService.getFriendsPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Posts of friends: ', this.posts);
        console.log(this.posts);
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while fetching data.';
      },
    });
  }
}
