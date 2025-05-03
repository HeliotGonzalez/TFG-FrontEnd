import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { AlfabetoComponent } from './alfabeto/alfabeto.component';
import { WordRegisterComponent } from './word-register/word-register.component';
import { VideoDisplayerComponent } from './video-displayer/video-displayer.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { VideoCreatorComponent } from './video-creator/video-creator.component';
import { WordListComponent } from './word-list/word-list.component';
import { WordsBySearchComponent } from './words-by-search/words-by-search.component';
import { wordRegisterGuardGuard } from './guards/word-register-guard.guard';
import { RandomWordComponent } from './random-word/random-word.component';
import { StudyComponent } from './study/study.component';
import { FlashccardsComponent } from './flashccards/flashccards.component';
import { PersonalQuizzComponent } from './personal-quizz/personal-quizz.component';
import { RecentlyUploadedComponent } from './recently-uploaded/recently-uploaded.component';
import { ThemesComponent } from './themes/themes.component';
import { ChekingVideosComponent } from './cheking-videos/cheking-videos.component';
import { MyVideosCorrectedComponent } from './my-videos-corrected/my-videos-corrected.component';
import { WordsRequiredComponent } from './words-required/words-required.component';
import { ProfileComponent } from './profile/profile.component';
import { ModifyProfileComponent } from './modify-profile/modify-profile.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'word-register', component: WordRegisterComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'alphabetical', component: AlfabetoComponent },
    { path: 'videoLoader', component: VideoDisplayerComponent },
    { path: 'dictionary', component: DictionaryComponent, canActivate: [wordRegisterGuardGuard] },
    { path:'createVideo', component: VideoCreatorComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'word-list', component: WordListComponent },
    { path: 'words-by-search', component: WordsBySearchComponent },
    { path: 'randomWord', component: RandomWordComponent },
    { path: 'study', component: StudyComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'flashcards', component: FlashccardsComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'personalQuizz', component: PersonalQuizzComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'recentlyUploaded', component: RecentlyUploadedComponent },
    { path: 'themes', component: ThemesComponent },
    { path: 'checkingVideo', component: ChekingVideosComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'myVideosCorrected', component: MyVideosCorrectedComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'wordRequested', component: WordsRequiredComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'profile/:id', component: ProfileComponent, canActivate: [wordRegisterGuardGuard] },
    { path: 'modify-profile', component: ModifyProfileComponent, canActivate: [wordRegisterGuardGuard] },
    { path: '**', redirectTo: '' }
];
