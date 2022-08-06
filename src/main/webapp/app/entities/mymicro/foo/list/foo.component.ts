import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoo } from '../foo.model';
import { FooService } from '../service/foo.service';
import { FooDeleteDialogComponent } from '../delete/foo-delete-dialog.component';

@Component({
  selector: 'jhi-foo',
  templateUrl: './foo.component.html',
})
export class FooComponent implements OnInit {
  foos?: IFoo[];
  isLoading = false;

  constructor(protected fooService: FooService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fooService.query().subscribe({
      next: (res: HttpResponse<IFoo[]>) => {
        this.isLoading = false;
        this.foos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFoo): number {
    return item.id!;
  }

  delete(foo: IFoo): void {
    const modalRef = this.modalService.open(FooDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.foo = foo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
