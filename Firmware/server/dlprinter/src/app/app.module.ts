import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { WebSocketService } from './services/web-socket.service';
import { StatusComponent } from './components/pages/status/status.component';
import { PrintComponent } from './components/pages/print/print.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DisconnectedDisplayComponent } from './components/ui/disconnected-display/disconnected-display.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StatusComponent,
    PrintComponent,
    SettingsComponent,
    DisconnectedDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ DisconnectedDisplayComponent ],
  providers: [ WebSocketService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
