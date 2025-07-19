import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Budget } from "./pages/budget/budget";

@Component({
  selector: 'app-root',
  imports: [ Budget],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
