import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.scss',
})
export class postHeaderComponent implements OnInit {
  userImageSource!: any;
  @Input() username!: any;
  @Input() user!: any;
  imageLink: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.imageLink = this.generateImageLink();
  }
  generateImageLink(): string {
    return `http://localhost:8000${this.userImageSource}`;
  }

  fetchImages() {
    this.userService.getUserByUserName
  }
}
