import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  public usrName : string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() 
  {
    this.usrName = this.auth.nombre;
    console.log(this.usrName);
  }

  onDificult(dificultad: string)
  {
    this.router.navigateByUrl('/juego/' + dificultad);
  }

  onLeaderboard()
  {
    this.router.navigateByUrl('/puntuacion');
  }

  cerrarSesion()
  {
    this.auth.logOut().then(next => {
      this.router.navigateByUrl('/login');
    }
    )
  }
}
