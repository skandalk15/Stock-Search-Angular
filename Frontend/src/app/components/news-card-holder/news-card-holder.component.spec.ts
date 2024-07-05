import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardHolderComponent } from './news-card-holder.component';

describe('NewsCardHolderComponent', () => {
  let component: NewsCardHolderComponent;
  let fixture: ComponentFixture<NewsCardHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsCardHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCardHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
