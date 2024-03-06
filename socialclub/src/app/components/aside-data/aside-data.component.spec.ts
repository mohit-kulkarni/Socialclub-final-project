import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideDataComponent } from './aside-data.component';

describe('AsideDataComponent', () => {
  let component: AsideDataComponent;
  let fixture: ComponentFixture<AsideDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsideDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsideDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
