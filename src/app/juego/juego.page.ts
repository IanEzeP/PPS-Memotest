import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  public dificultad: any;
  public cartasArray: Array<any> = [];

  public aciertosConseguidos: number = 0;
  public aciertosTotales: number = 0;
  public cartasLevantadas: number = 0;
  public idAnterior: number = 0;
  public idCartaAnterior: number = 0;

  public destroy = new Subject();
  public juegoTerminado = false;
  public timer: number = 0;

  rxjsTimer = timer(0, 1000);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() 
  {
    this.dificultad = this.route.snapshot.paramMap.get('dificultad');
    console.log(this.dificultad);

    this.cargarCartas();
    this.cargarTimer();
  }

  cargarTimer()
  {
    this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => {
      this.timer = val;

      if (this.juegoTerminado == true) {
        this.destroy.next('done');
        this.destroy.complete();
      }
    });
  }

  onTurnCarta(cartaId: number, btnId: number)
  {
    this.cartasLevantadas++;
    if(this.cartasLevantadas == 2)
    {
      this.cartasArray[btnId].visible = true;
      
      const btn = <HTMLButtonElement> document.getElementById(btnId.toString());
      btn.classList.add('disabled');

      this.cartasLevantadas = 0;
      if(cartaId == this.idAnterior)
      {
        this.aciertosConseguidos++;
        console.log("Acierto");
        if(this.aciertosConseguidos == this.aciertosTotales)
        {
          this.juegoTerminado = true;
          console.log("Termino el juego");
        }
      }
      else
      {
        console.log("Fallo");

        btn.classList.remove('disabled');
        const btnAnterior = <HTMLButtonElement> document.getElementById(this.idCartaAnterior.toString());
        btnAnterior.classList.remove('disabled');
        setTimeout(() => {
          this.cartasArray[btnId].visible = false;
          this.cartasArray[this.idCartaAnterior].visible = false;
        }, 600);
      }
    }
    else
    {
      this.cartasArray[btnId].visible = true;
      this.idAnterior = cartaId;
      this.idCartaAnterior = btnId;

      const btn = <HTMLButtonElement> document.getElementById(btnId.toString());
      btn.classList.add('disabled'); 
    }
  }

  cargarCartas() 
  {
    let contador = 0;
    let arrayTmp = [];
    switch (this.dificultad) 
    {
      case 'facil':
        while (contador < 3)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = 'assets/imagenes/animals/elephant.png';
        arrayTmp[1].img = 'assets/imagenes/animals/lion.png';
        arrayTmp[2].img = 'assets/imagenes/animals/sheep.png';

        arrayTmp.forEach(carta => {
          let clon = { img: carta.img, id: carta.id, visible: false};
          this.cartasArray.push(carta);
          this.cartasArray.push(clon);
        });

        this.aleatorizarArray();
        break;
      case 'medio':
        while (contador < 5)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = '../../assets/';
        arrayTmp[1].img = '../../assets/';
        arrayTmp[2].img = '../../assets/';
        arrayTmp[3].img = '../../assets/';
        arrayTmp[4].img = '../../assets/';

        arrayTmp.forEach(carta => {
          let clon = { img: carta.img, id: carta.id, visible: false};
          this.cartasArray.push(carta);
          this.cartasArray.push(clon);
        });

        this.aleatorizarArray();
        break;
      case 'dificil':
        while (contador < 8)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = '../../assets/';
        arrayTmp[1].img = '../../assets/';
        arrayTmp[2].img = '../../assets/';
        arrayTmp[3].img = '../../assets/';
        arrayTmp[4].img = '../../assets/';
        arrayTmp[5].img = '../../assets/';
        arrayTmp[6].img = '../../assets/';
        arrayTmp[7].img = '../../assets/';

        arrayTmp.forEach(carta => {
          let clon = { img: carta.img, id: carta.id, visible: false};
          this.cartasArray.push(carta);
          this.cartasArray.push(clon);
        });

        this.aleatorizarArray();
        break;
    }

    this.aciertosTotales = this.cartasArray.length / 2;
  }

  aleatorizarArray()
  {
    for (let i = this.cartasArray.length - 1; i > 0; i--) 
    {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartasArray[i], this.cartasArray[j]] = [this.cartasArray[j], this.cartasArray[i]];
    }
  }
}
