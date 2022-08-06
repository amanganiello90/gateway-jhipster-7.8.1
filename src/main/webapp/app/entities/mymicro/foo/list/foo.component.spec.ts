import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FooService } from '../service/foo.service';

import { FooComponent } from './foo.component';

describe('Foo Management Component', () => {
  let comp: FooComponent;
  let fixture: ComponentFixture<FooComponent>;
  let service: FooService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FooComponent],
    })
      .overrideTemplate(FooComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FooComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FooService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.foos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
