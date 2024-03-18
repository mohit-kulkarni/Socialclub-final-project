import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Story } from '../../interfaces/story';

@Component({
  selector: 'app-stories-view',
  templateUrl: './stories-view.component.html',
  styleUrl: './stories-view.component.scss',
})
export class StoriesViewComponent implements OnInit {
  story: Story;
  constructor(
    private dialogRef: MatDialogRef<StoriesViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

    generateImageLink(imageSource): string {
    return `http://localhost:8000${imageSource}`;
  }

  ngOnInit(): void {
    this.story = this.data.story;
    console.log(this.story);
  }
}
