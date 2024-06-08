import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-puntuacion',
  templateUrl: './puntuacion.page.html',
  styleUrls: ['./puntuacion.page.scss'],
})
export class PuntuacionPage implements OnInit, OnDestroy {

  private obsDatabase: Subscription = Subscription.EMPTY;

  public usuarios: Array<any> = [];
  public topPuntos: Array<any> = [];
  public dificultad: string = 'facil';

  public dificultadInicial: any = undefined;

  constructor(private data: DatabaseService, private router: Router) { }

  ngOnInit()
  {
    this.obsDatabase = this.data.getCollectionObservable('puntos-memotest').subscribe((next: any) =>
    {
      let result: Array<any> = next;
      this.usuarios = [];
      
      result.forEach((obj: any) => {
        obj.fecha = new Date(obj.fecha.seconds * 1000);
        obj.fecha = obj.fecha.toLocaleDateString() + ' ' + obj.fecha.toLocaleTimeString()
        this.usuarios.push(obj);
      });
      this.usuarios.sort((a, b) => a.tiempo - b.tiempo);
      
      console.log("finalizo carga");
      this.dificultadInicial = { target: {value: this.dificultad}};
      this.onChangeDif(this.dificultadInicial);
    });
  }

  ngOnDestroy(): void 
  {
    this.obsDatabase.unsubscribe();
  }

  onChangeDif(selection: any) 
  {
    this.dificultad = selection.target.value; 
    switch (this.dificultad)
    {
      case 'facil':
        this.topPuntos = [];
        this.usuarios.forEach(data => {
          if(data.dificultad == 'facil')
          {
            if(this.topPuntos.length < 5)
            {
              this.topPuntos.push(data);
            }
          }
        });
        break;
      case 'medio':
        this.topPuntos = [];
        this.usuarios.forEach(data => {
          if(data.dificultad == 'medio')
          {
            if(this.topPuntos.length < 5)
            {
              this.topPuntos.push(data);
            }
          }
        });
        break;
      case 'dificil':
        this.topPuntos = [];
        this.usuarios.forEach(data => {
          if(data.dificultad == 'dificil')
          {
            if(this.topPuntos.length < 5)
            {
              this.topPuntos.push(data);
            }
          }
        });
        break;
    }
  }

  onVolver()
  {
    this.router.navigateByUrl('/main');
  }
}
