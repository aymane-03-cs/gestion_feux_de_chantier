import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertListComponent } from './alert-list.component';

describe('AlertListComponent', () => {
  let component: AlertListComponent;
  let fixture: ComponentFixture<AlertListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
