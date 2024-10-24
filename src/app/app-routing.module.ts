import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
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
    path: "logout",
    loadChildren: () =>
      import("./pages/logout/logout.module").then((m) => m.LogoutPageModule),
  },
  {
    path: "home",
    canActivate: [AuthGuardService], 
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "tabs",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./pages/tabs/tabs.module").then((m) => m.TabsPageModule),
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
    path: "chat",
    canActivate: [AuthGuardService], 
    loadChildren: () =>
      import("./pages/chat/chat.module").then((m) => m.ChatPageModule),
  },
  {
    path: "chat-request",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./pages/chat-request/chat-request.module").then(
        (m) => m.ChatRequestPageModule
      ),
  },
  {
    path: 'add-quiz',
    loadChildren: () => import('./pages/add-quiz/add-quiz.module').then( m => m.AddQuizPageModule)
  },
  {
    path: 'quiz-list',
    loadChildren: () => import('./pages/quiz-list/quiz-list.module').then( m => m.QuizListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
