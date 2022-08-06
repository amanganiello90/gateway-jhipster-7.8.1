import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'foo',
        data: { pageTitle: 'mygatewayclientApp.mymicroFoo.home.title' },
        loadChildren: () => import('./mymicro/foo/foo.module').then(m => m.MymicroFooModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
