import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Story } from '../../interfaces/story';
import { StoryService } from '../../services/story.service';
import { MatDialog } from '@angular/material/dialog';
import { StoriesViewComponent } from '../stories-view/stories-view.component';
import { StoriesNewComponent } from '../stories-new/stories-new.component';

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
  userImageSource = `http://localhost:8000/${sessionStorage.getItem(
    'profile_pic'
  )}`;
  userUsername = sessionStorage.getItem('username');

  constructor(
    private userService: UserService,
    private storyService: StoryService,
    private dialog: MatDialog
  ) {}

  // fetchStories(): void {
  //   this.userService.getAllUsers().subscribe(
  //     (data) => {
  //       this.users = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching users:', error);
  //     }
  //   );
  // }

  fetchStories(): void {
    this.storyService.getStories().subscribe(
      (stories) => {
        this.stories = stories;
        console.log(`Stories:`);
        console.log(stories);
      },
      (error) => {
        console.error('Error fetching stories:', error);
      }
    );
  }

  openStoryView(story: any) {
    const dialogRef = this.dialog.open(StoriesViewComponent, {
      width: '600px',
      data: { story: story }, // Pass the selected story as data
      panelClass: 'custom-dialog-container',
    });

    // Subscribe to the dialog after it's closed
    dialogRef
      .afterClosed()
      .subscribe(() => console.log('The dialog was closed'));
  }

  openNewStoryModal() {
    const dialogRef = this.dialog.open(StoriesNewComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef
      .afterClosed()
      .subscribe(() => console.log('New Story Dialog Closed.'));
  }

  generateImageLink(imageSource): string {
    return `http://localhost:8000${imageSource}`;
  }

  ngOnInit(): void {
    this.fetchStories();
    console.log(`fetching stories oninit`);

    // this.imageLink = this.generateImageLink()
  }
}
