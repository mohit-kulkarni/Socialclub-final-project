import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesViewComponent } from './stories-view.component';

describe('StoriesViewComponent', () => {
  let component: StoriesViewComponent;
  let fixture: ComponentFixture<StoriesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoriesViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
