import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./services/auth-guard.service";


const routes: Routes = [
  {
    path: "",
    redirectTo: "quiz-list",
    pathMatch: "full",
  },
  {
    path: "registration",
    loadChildren: () =>
      import("./pages/registration/registration.module").then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "otp-verification",
    loadChildren: () =>
      import("./pages/otp-verification/otp-verification.module").then(
        (m) => m.OtpVerificationPageModule
      ),
  },
  {
    path: "settings",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./pages/settings/settings.module").then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: "chat/:roomId",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./pages/chat/chat.module").then((m) => m.ChatPageModule),
  },
  {
    path: 'add-quiz',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/add-quiz/add-quiz.module').then(m => m.AddQuizPageModule)
  },
  {
    path: 'edit-quiz/:id',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/add-quiz/add-quiz.module').then(m => m.AddQuizPageModule)
  },
  {
    path: 'quiz-list',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/quiz-list/quiz-list.module').then(m => m.QuizListPageModule)
  },
  {
    path: 'wellcome',
    loadChildren: () => import('./pages/wellcome/wellcome.module').then(m => m.WellcomePageModule)
  },
  {
    path: 'edit-profile',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'quiz-question/:id',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/quiz-question/quiz-question.module').then(m => m.QuizQuestionPageModule)
  },
  {
    path: 'quiz-responses/:id',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/quiz-responses/quiz-responses.module').then(m => m.QuizResponsesPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./pages/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'quiz-group-list',
    loadChildren: () => import('./pages/quiz-group-list/quiz-group-list.module').then( m => m.QuizGroupListPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
