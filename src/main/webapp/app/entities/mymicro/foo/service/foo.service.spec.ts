import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFoo, Foo } from '../foo.model';

import { FooService } from './foo.service';

describe('Foo Service', () => {
  let service: FooService;
  let httpMock: HttpTestingController;
  let elemDefault: IFoo;
  let expectedResult: IFoo | IFoo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FooService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      value: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Foo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Foo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Foo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          value: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Foo', () => {
      const patchObject = Object.assign({}, new Foo());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Foo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          value: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Foo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFooToCollectionIfMissing', () => {
      it('should add a Foo to an empty array', () => {
        const foo: IFoo = { id: 123 };
        expectedResult = service.addFooToCollectionIfMissing([], foo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foo);
      });

      it('should not add a Foo to an array that contains it', () => {
        const foo: IFoo = { id: 123 };
        const fooCollection: IFoo[] = [
          {
            ...foo,
          },
          { id: 456 },
        ];
        expectedResult = service.addFooToCollectionIfMissing(fooCollection, foo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Foo to an array that doesn't contain it", () => {
        const foo: IFoo = { id: 123 };
        const fooCollection: IFoo[] = [{ id: 456 }];
        expectedResult = service.addFooToCollectionIfMissing(fooCollection, foo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foo);
      });

      it('should add only unique Foo to an array', () => {
        const fooArray: IFoo[] = [{ id: 123 }, { id: 456 }, { id: 29021 }];
        const fooCollection: IFoo[] = [{ id: 123 }];
        expectedResult = service.addFooToCollectionIfMissing(fooCollection, ...fooArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const foo: IFoo = { id: 123 };
        const foo2: IFoo = { id: 456 };
        expectedResult = service.addFooToCollectionIfMissing([], foo, foo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foo);
        expect(expectedResult).toContain(foo2);
      });

      it('should accept null and undefined values', () => {
        const foo: IFoo = { id: 123 };
        expectedResult = service.addFooToCollectionIfMissing([], null, foo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foo);
      });

      it('should return initial array if no Foo is added', () => {
        const fooCollection: IFoo[] = [{ id: 123 }];
        expectedResult = service.addFooToCollectionIfMissing(fooCollection, undefined, null);
        expect(expectedResult).toEqual(fooCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
