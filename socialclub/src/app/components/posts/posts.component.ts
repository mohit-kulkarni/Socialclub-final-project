import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
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

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  isRotated: boolean = false;

  toggleRotation() {
    this.isRotated = !this.isRotated;
  }

  fetchData() {
    this.apiService.getFriendsPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Posts of friends: ', this.posts);
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while fetching data.';
      },
    });
  }
}
