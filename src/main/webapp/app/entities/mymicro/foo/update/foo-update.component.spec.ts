import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FooService } from '../service/foo.service';
import { IFoo, Foo } from '../foo.model';

import { FooUpdateComponent } from './foo-update.component';

describe('Foo Management Update Component', () => {
  let comp: FooUpdateComponent;
  let fixture: ComponentFixture<FooUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fooService: FooService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FooUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FooUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FooUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fooService = TestBed.inject(FooService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const foo: IFoo = { id: 456 };

      activatedRoute.data = of({ foo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(foo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foo>>();
      const foo = { id: 123 };
      jest.spyOn(fooService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fooService.update).toHaveBeenCalledWith(foo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foo>>();
      const foo = new Foo();
      jest.spyOn(fooService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foo }));
      saveSubject.complete();

      // THEN
      expect(fooService.create).toHaveBeenCalledWith(foo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Foo>>();
      const foo = { id: 123 };
      jest.spyOn(fooService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fooService.update).toHaveBeenCalledWith(foo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
