import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { AlfabetoComponent } from './alfabeto/alfabeto.component';
import { WordRegisterComponent } from './word-register/word-register.component';
import { VideoDisplayerComponent } from './video-displayer/video-displayer.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { authDictionaryGuard } from './guards/auth-dictionary.guard';
import { VideoCreatorComponent } from './video-creator/video-creator.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'word-register', component: WordRegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'alphabetical', component: AlfabetoComponent },
    { path: 'videoLoader', component: VideoDisplayerComponent },
    { path: 'dictionary', component: DictionaryComponent, canActivate: [authDictionaryGuard] },
    { path:'createVideo', component: VideoCreatorComponent },
    { path: '**', redirectTo: '' }
];
