import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/post';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  error: string | null = null;
  loading = true;

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.apiservice.getFriendsPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
        console.log('Posts of friends: ', this.posts);
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while fetching data.';
        this.loading = false;
      },
    });
  }
}
