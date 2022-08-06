import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFoo, Foo } from '../foo.model';
import { FooService } from '../service/foo.service';

@Component({
  selector: 'jhi-foo-update',
  templateUrl: './foo-update.component.html',
})
export class FooUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [],
    value: [],
  });

  constructor(protected fooService: FooService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foo }) => {
      this.updateForm(foo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foo = this.createFromForm();
    if (foo.id !== undefined) {
      this.subscribeToSaveResponse(this.fooService.update(foo));
    } else {
      this.subscribeToSaveResponse(this.fooService.create(foo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(foo: IFoo): void {
    this.editForm.patchValue({
      id: foo.id,
      code: foo.code,
      value: foo.value,
    });
  }

  protected createFromForm(): IFoo {
    return {
      ...new Foo(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
