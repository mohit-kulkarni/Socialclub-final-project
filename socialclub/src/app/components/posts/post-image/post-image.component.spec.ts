import { ComponentFixture, TestBed } from '@angular/core/testing';

import { postImageComponent } from './post-image.component';

describe('postImageComponent', () => {
  let component: postImageComponent;
  let fixture: ComponentFixture<postImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [postImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(postImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
