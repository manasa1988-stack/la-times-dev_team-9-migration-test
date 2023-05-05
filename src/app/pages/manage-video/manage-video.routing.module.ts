import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageVideoComponent } from './manage-video.component';

const routes: Routes = [
  {
    path: '',
    component: ManageVideoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManageVideoRoutingModule { }