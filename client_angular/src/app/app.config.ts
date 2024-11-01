import {
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling, withPreloading,
  withRouterConfig, withViewTransitions
} from '@angular/router';
import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {CustomPreloadingStrategy, routes} from "./app.routes";
import {DropdownModule, SidebarModule} from "@coreui/angular";
import {ToastrModule} from "ngx-toastr";
import {IconSetService} from "@coreui/icons-angular";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),

      withPreloading(CustomPreloadingStrategy)
    ),
    importProvidersFrom(SidebarModule, DropdownModule, ToastrModule.forRoot(), ),
    IconSetService,
    provideAnimations(),
    provideHttpClient(),
    CustomPreloadingStrategy,
  ]
};
