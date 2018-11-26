import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/ui/header/header.component';
import { LayoutComponent } from './components/ui/layout/layout.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { WebSocketService } from './services/web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LayoutComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [ WebSocketService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
