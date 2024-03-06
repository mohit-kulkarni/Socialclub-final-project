import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, Input, OnInit } from '@angular/core';

import { postsComponent } from './posts.component';

describe('postsComponent', () => {
  let component: postsComponent;
  let fixture: ComponentFixture<postsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [postsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(postsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
