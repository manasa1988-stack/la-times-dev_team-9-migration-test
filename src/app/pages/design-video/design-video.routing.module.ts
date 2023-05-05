import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignVideoComponent } from './design-video.component';

const routes: Routes = [
  {
    path: '',
    component: DesignVideoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DesignVideoRoutingModule { }
