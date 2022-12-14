import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoo } from '../foo.model';
import { FooService } from '../service/foo.service';

@Component({
  templateUrl: './foo-delete-dialog.component.html',
})
export class FooDeleteDialogComponent {
  foo?: IFoo;

  constructor(protected fooService: FooService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fooService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
