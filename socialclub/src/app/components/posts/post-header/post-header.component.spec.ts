import { ComponentFixture, TestBed } from '@angular/core/testing';

import { postHeaderComponent } from './post-header.component';

describe('postHeaderComponent', () => {
  let component: postHeaderComponent;
  let fixture: ComponentFixture<postHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [postHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(postHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
