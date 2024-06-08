import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    Swal.fire(
      {
        heightAuto: false,
        title: "¿Desea cerrar su sesión?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Cerrar",
        cancelButtonText: "Cancelar"
      }
    ).then((result) => {
      if (result.isConfirmed) {
        this.auth.logOut().then(() => {
          this.router.navigateByUrl('/login');
        });
      }
    });
  }
}
