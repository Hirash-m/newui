import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountTypeComponent } from './count-type.component';

describe('CountTypeComponent', () => {
  let component: CountTypeComponent;
  let fixture: ComponentFixture<CountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
