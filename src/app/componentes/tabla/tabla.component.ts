import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataApiService } from './../../servicios/data-api.service';
import { Persona } from './../../entidad/persona';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'tablaForm',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  @ViewChild('btnClose', { static: false }) btnClose: ElementRef;
  //recibimos el arreglo de personas.
  personas: Persona[] = [];
  persona: Persona = {
    id: 0,
    nombre: '',
    apellido: '',
    dni: 0,
  };
  public formGroup: FormGroup;

  constructor(private servicio: DataApiService, private router: Router, private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder) { }
  //cargamos el getall y el buildForm al mismo tiempo.
  public ngOnInit() {
    this.getAll();
    this.buildForm();
  }

  //igualando valores, con validator
  public buildForm() {
    this.formGroup = this.formBuilder.group({
      id: [this.persona.id,Validators.required],
      nombre: [this.persona.nombre,Validators.required],
      apellido: [this.persona.apellido,Validators.required],
      dni: [this.persona.dni,Validators.required]
    });
  }

//----------------------------------------GETALL---------------------------------------
  getAll() {
    this.servicio.getAll().subscribe(data => {
      this.personas = data;
      console.log(this.personas);
    },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')

    );
  }
//----------------------------------------DELETE------------------------------------------
  delete(id: number, cont: number) {
    const opcion = confirm('¿Desea Eliminar el Contacto?');
    if (opcion === true) {
      this.servicio.delete(id).subscribe(data => {
        console.log(data);
        alert('Contacto Eliminado');
        this.buildForm();
        this.personas.splice(cont, 1);

      },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
    }
  }
  //--------------------------------------AGREGAR PERSONA-----------------------------------------
  agregar(persona: Persona) {
    console.log(persona);
    this.servicio.post(persona).subscribe(data => {
      this.persona = data;
      console.log(data);
      this.personas.push(this.persona);
    },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')
    );

  }
  // -------------------------------------------------ACTUALIZAR--------------------------------
  actualizar(persona: Persona) {
    this.persona = persona;
    this.buildForm();
  }
  //---------------------------------------------------ADD--------------------------------------
  add() {
    const persona: Persona = {
      id: 0,
      nombre: '',
      apellido: '',
      dni: 0,
    };
    this.persona = persona;
    this.buildForm();
  }
  //---------------------------------------------------UPDATE-----------------------------------
  update(persona: Persona) {
    const idPersona = persona.id;
    this.servicio.put(idPersona, persona).subscribe(data => {
      this.persona = data;
      const id = this.persona.id;
      const nombre = this.persona.nombre;
      const apellido = this.persona.apellido;
      const dni = this.persona.dni;
       this.personas.map(function (dato) {
        if (dato.id === id) {
          dato.nombre = nombre;
          dato.apellido = apellido;
          dato.dni = dni;

        }
      });

    },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')
    );

  }
//-----------------------------------------------SAVE--------------------------------------------
  save(formGroup: FormGroup, cont: number) {

    if (formGroup.value.id === 0) {
      this.agregar(formGroup.value);
    } else {
      this.update(formGroup.value);

    }
    formGroup.reset();
    this.btnClose.nativeElement.click();
  }


}
