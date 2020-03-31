import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualizeComponent } from './components/visualize/visualize.component';
import { DiscoverComponent } from './components/discover/discover.component';


const routes: Routes = [
  {
    path : '',
    component : DiscoverComponent
  },
  {
    path : 'visualize',
    component : VisualizeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
