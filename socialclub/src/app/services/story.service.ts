import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Story } from '../interfaces/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = 'http://localhost:8000/api/stories/';
  private auth_token = sessionStorage.getItem('auth_token');

  constructor(private http: HttpClient) {}

  getStories(): Observable<Story[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });
    const stories = this.http.get<Story[]>(this.apiUrl, { headers });
    console.log(stories);
    return stories;
  }

  getValidStories(): Observable<Story[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });
    return this.http.get<Story[]>(this.apiUrl, { headers }).pipe(
      // Filter out stories that are no longer valid
      map((stories) => stories.filter((story) => this.isValidStory(story)))
    );
  }

  private isValidStory(story: Story): boolean {
    // Calculate if the story is still valid (less than 24 hours old)
    const storyCreatedAt = new Date(story.created_at);
    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(
      currentTime.getTime() - 24 * 60 * 60 * 1000
    );
    return storyCreatedAt >= twentyFourHoursAgo;
  }

  createStory(story: Story): Observable<Story> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });
    return this.http.post<Story>(this.apiUrl, story, { headers });
  }

  deleteStory(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<void>(url, { headers });
  }
}
