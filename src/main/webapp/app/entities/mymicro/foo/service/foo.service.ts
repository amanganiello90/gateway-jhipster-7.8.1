import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoo, getFooIdentifier } from '../foo.model';

export type EntityResponseType = HttpResponse<IFoo>;
export type EntityArrayResponseType = HttpResponse<IFoo[]>;

@Injectable({ providedIn: 'root' })
export class FooService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foos', 'mymicro');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foo: IFoo): Observable<EntityResponseType> {
    return this.http.post<IFoo>(this.resourceUrl, foo, { observe: 'response' });
  }

  update(foo: IFoo): Observable<EntityResponseType> {
    return this.http.put<IFoo>(`${this.resourceUrl}/${getFooIdentifier(foo) as number}`, foo, { observe: 'response' });
  }

  partialUpdate(foo: IFoo): Observable<EntityResponseType> {
    return this.http.patch<IFoo>(`${this.resourceUrl}/${getFooIdentifier(foo) as number}`, foo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFoo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFoo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFooToCollectionIfMissing(fooCollection: IFoo[], ...foosToCheck: (IFoo | null | undefined)[]): IFoo[] {
    const foos: IFoo[] = foosToCheck.filter(isPresent);
    if (foos.length > 0) {
      const fooCollectionIdentifiers = fooCollection.map(fooItem => getFooIdentifier(fooItem)!);
      const foosToAdd = foos.filter(fooItem => {
        const fooIdentifier = getFooIdentifier(fooItem);
        if (fooIdentifier == null || fooCollectionIdentifiers.includes(fooIdentifier)) {
          return false;
        }
        fooCollectionIdentifiers.push(fooIdentifier);
        return true;
      });
      return [...foosToAdd, ...fooCollection];
    }
    return fooCollection;
  }
}
