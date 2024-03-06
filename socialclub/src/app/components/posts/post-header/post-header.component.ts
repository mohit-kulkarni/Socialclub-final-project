import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.scss',
})
export class postHeaderComponent implements OnInit {
  @Input() userImageSource!: any;
  @Input() username!: any;
  @Input() user!: any;
  imageLink: string;

  constructor() {}

  ngOnInit(): void {
    this.imageLink = this.generateImageLink();
  }
  generateImageLink(): string {
    return `http://localhost:8000${this.userImageSource}`;
  }
}
