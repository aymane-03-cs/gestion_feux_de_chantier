import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireManagementComponent } from './fire-management.component';

describe('FireManagementComponent', () => {
  let component: FireManagementComponent;
  let fixture: ComponentFixture<FireManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FireManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
