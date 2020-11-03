import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HikerinfosPage } from './hikerinfos.page';

describe('HikerinfosPage', () => {
  let component: HikerinfosPage;
  let fixture: ComponentFixture<HikerinfosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikerinfosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HikerinfosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
