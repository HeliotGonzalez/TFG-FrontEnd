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
import { SearchContactsComponent } from './search-contacts/search-contacts.component';
import { UploadedByMyFriendsComponent } from './uploaded-by-my-friends/uploaded-by-my-friends.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { ChatComponent } from './chat/chat.component';
import { ExpertStatsComponent } from './expert-stats/expert-stats.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ColaborateComponent } from './colaborate/colaborate.component';
import { SendSuggestionComponent } from './send-suggestion/send-suggestion.component';
import { AyudaComponent } from './ayuda/ayuda.component';

export const routes: Routes = [
  // Rutas públicas sólo para invitados
  { path: 'login',    component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Rutas públicas (no requieren sesión)
  { path: '',                component: HomepageComponent },
  { path: 'word-list',       component: WordListComponent },
  { path: 'words-by-search', component: WordsBySearchComponent },
  { path: 'randomWord',      component: RandomWordComponent },
  { path: 'alphabetical',    component: AlfabetoComponent },
  { path: 'videoLoader',     component: VideoDisplayerComponent },
  { path: 'recentlyUploaded', component: RecentlyUploadedComponent },
  { path: 'themes',          component: ThemesComponent },
  { path: 'AboutUs',          component: AboutUsComponent },
  { path: 'colaborate',          component: ColaborateComponent },
  { path: 'sendSuggestion',          component: SendSuggestionComponent },
  { path: 'help',                 component: AyudaComponent },


  // Rutas que requieren estar autenticado
  { path: 'word-register',   component: WordRegisterComponent,   canActivate: [authGuard] },
  { path: 'dictionary',      component: DictionaryComponent,     canActivate: [authGuard] },
  { path: 'createVideo',     component: VideoCreatorComponent,    canActivate: [authGuard] },
  { path: 'study',           component: StudyComponent,           canActivate: [authGuard] },
  { path: 'flashcards',      component: FlashccardsComponent,     canActivate: [authGuard] },
  { path: 'personalQuizz',   component: PersonalQuizzComponent,    canActivate: [authGuard] },
  { path: 'checkingVideo',   component: ChekingVideosComponent,   canActivate: [authGuard] },
  { path: 'myVideosCorrected', component: MyVideosCorrectedComponent, canActivate: [authGuard] },
  { path: 'wordRequested',   component: WordsRequiredComponent,    canActivate: [authGuard] },
  { path: 'profile/:id',     component: ProfileComponent,          canActivate: [authGuard] },
  { path: 'modify-profile',  component: ModifyProfileComponent,    canActivate: [authGuard] },
  { path: 'search',          component: SearchContactsComponent,   canActivate: [authGuard] },
  { path: 'uploadedByMyFriends', component: UploadedByMyFriendsComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'ExpertStats', component: ExpertStatsComponent, canActivate: [authGuard]},


  // Wildcard
  { path: '**', redirectTo: '' }
];
