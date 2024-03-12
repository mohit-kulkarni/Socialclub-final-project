import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Story } from '../../interfaces/story';
import { StoryService } from '../../services/story.service';
import { MatDialog } from '@angular/material/dialog'; 

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent implements OnInit {
  users: User[] | any = [];
  stories: Story[];
  imageLink: string;
  noUser = '../../../assets/img/no_user.jpg';

  constructor(
    private userService: UserService,
    private storyService: StoryService,
    private dialog: MatDialog
  ) {}

  generateStories(): User[] {
    let storiesQuantity = 0;
    let users: User[] = [];

    for (let i = 0; i < storiesQuantity; i++) {
      users.push({
        username: 'Username',
        profile_pic: '../../../assets/img/no_user.jpg',
      });
    }

    return users;
  }

  fetchStories(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // fetchStories(): void {
  //   this.storyService.getStories().subscribe(
  //     (stories) => {
  //       this.stories = stories;
  //       console.log(`Stories: ${stories}`);
  //     },
  //     (error) => {
  //       console.error('Error fetching stories:', error);
  //     }
  //   );
  // }

  generateImageLink(imageSource): string {
    return `http://localhost:8000${imageSource}`;
  }

  ngOnInit(): void {
    this.fetchStories();
    // this.imageLink = this.generateImageLink()
  }
}
