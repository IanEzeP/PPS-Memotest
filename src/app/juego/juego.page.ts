import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  public dificultad: any;
  public showDificultad: string = '';
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

  constructor(private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore,
    private auth: AuthService) {}

  ngOnInit() 
  {
    this.dificultad = this.route.snapshot.paramMap.get('dificultad');

    this.cargarCartas();
    this.cargarTimer();
  }

  cargarTimer()
  {
    this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val:any) => {
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

          this.finalizarJuego()
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

  async finalizarJuego()
  {
    let id_imagen = this.firestore.createId();
    const documento = this.firestore.doc("puntos-memotest/" + id_imagen);
    documento.set(
    {
      tiempo : this.timer,
      usuario: this.auth.nombre,
      dificultad: this.dificultad,
      fecha: new Date(),
    });

    await Swal.fire(
      {
        heightAuto: false,
        title: "Partida finalizada",
        text: "Tiempo total: " + this.timer + " segundos",
        showDenyButton: true,
        denyButtonColor: "#5DE2E7",
        denyButtonText: "Volver al menú",
        confirmButtonColor: "#7DDA58",
        confirmButtonText: "Ver tabla de puntuación",
      }
    ).then((result) => {
      if (result.isConfirmed) 
      {
        this.router.navigateByUrl('/puntuacion');
      }
      else if (result.isDenied)
      {
        this.router.navigateByUrl('/main');  
      }
    });
  }

  cargarCartas() 
  {
    let contador = 0;
    let arrayTmp = [];

    switch (this.dificultad) 
    {
      case 'facil':
        this.showDificultad = 'Fácil';
        while (contador < 3)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = 'assets/imagenes/animals/elephant.png';
        arrayTmp[1].img = 'assets/imagenes/animals/lion.png';
        arrayTmp[2].img = 'assets/imagenes/animals/sheep.png';

        break;
      case 'medio':
        this.showDificultad = 'Medio';
        while (contador < 5)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = 'assets/imagenes/tools/tool-1.png';
        arrayTmp[1].img = 'assets/imagenes/tools/tool-2.png';
        arrayTmp[2].img = 'assets/imagenes/tools/tool-3.png';
        arrayTmp[3].img = 'assets/imagenes/tools/tool-4.png';
        arrayTmp[4].img = 'assets/imagenes/tools/tool-5.png';

        break;
      case 'dificil':
        this.showDificultad = 'Difícil';
        while (contador < 8)
        {
          arrayTmp[contador] = { img: '', id: contador, visible: false};
          contador++;
        }
        arrayTmp[0].img = 'assets/imagenes/fruits/fruit-1.png';
        arrayTmp[1].img = 'assets/imagenes/fruits/fruit-2.png';
        arrayTmp[2].img = 'assets/imagenes/fruits/fruit-3.png';
        arrayTmp[3].img = 'assets/imagenes/fruits/fruit-4.png';
        arrayTmp[4].img = 'assets/imagenes/fruits/fruit-5.png';
        arrayTmp[5].img = 'assets/imagenes/fruits/fruit-6.png';
        arrayTmp[6].img = 'assets/imagenes/fruits/fruit-7.png';
        arrayTmp[7].img = 'assets/imagenes/fruits/fruit-8.png';

        break;
    }
    arrayTmp.forEach(carta => {
      let clon = { img: carta.img, id: carta.id, visible: false};
      this.cartasArray.push(carta);
      this.cartasArray.push(clon);
    });

    this.aleatorizarArray();

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
