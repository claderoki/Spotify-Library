import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';

const routes: Routes =
[
    { path: 'auth', component: AuthComponent },
    // { path : "songs", component : SongsComponent, canActivate: [AuthGuard]},
    // { path : "search", component : SearchTracksComponent, canActivate: [AuthGuard]},
    // { path : "reviews", component : ReviewsComponent, canActivate: [AuthGuard]},
    { path : 'home' ,component: HomeComponent},
    { path : '' ,component: HomeComponent},
];

@NgModule(
{
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class AppRoutingModule
{

}
