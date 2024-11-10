import { EmployeeService } from '../../shared/services/employee.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from './../../models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employeeNew: boolean = false;
  isEdit : boolean = false;
  employees: Employee[] = [];
  employeModel : Employee = new Employee();

  employeeTypes = [
    { value: 'local'},
    { value: 'externo'}
  ];

  constructor(private employeeService: EmployeeService) {}

  async ngOnInit():Promise<void> {
    await this.getEmployees();
  }

  onEmployeeNew(): void {
    this.employeeNew = true;
  }

  onBack(): void {
    this.employeeNew = false;
    if(this.isEdit){
      this.onCancel();
      this.isEdit = false;
    }
  }

  onCancel():void{
    this.employeeNew = false;
    this.ngOnInit();
    this.employeModel = new Employee();
  }

  // Obtener lista de empleados
  async getEmployees():Promise<void>{
    this.employeeService.getEmployees()
    .then(data => {
      this.employees = data;
    })
    .catch(error => {
      console.log('Error al optener los empleados'+ error)
      alert('Error al optener los empleados'+ error);
    });
  }

  onEditEmployee(employee: Employee): void {
    this.employeModel = {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName || '',
      rfc: employee.rfc,
      dateOfBirth: employee.dateOfBirth,
      employeeType: employee.employeeType,
      hourlySalary: employee.hourlySalary,
      hoursWorkedPerWeek: employee.hoursWorkedPerWeek
    };
    console.log(this.employeModel.dateOfBirth);
    this.employeeNew = true;
    this.isEdit = true;
  }

  // Creación o actualización
  async onSaveEmployee(): Promise<void> {
    const validationErrors = await this.validateEmployeeFields();

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    if (this.employeModel.id === 0 || !this.employeModel.id) {
      // Crear un nuevo empleado
      this.employeeService.createEmployee(this.employeModel)
        .then(newEmployee => {
          console.log('Empleado creado:', newEmployee);
          alert("Empleado creado con exito")
          this.onCancel();
        })
        .catch(error => {
          console.error('Error al crear el empleado', error);
          alert('Error al crear el empleado'+ error);
        });
    } else {
      // Actualizar el empleado existente
      this.employeeService.updateEmployee(this.employeModel)
        .then(updatedEmployee => {
          console.log('Empleado actualizado:', updatedEmployee);
          alert("Empleado actualizado con exito");
          this.onCancel();
        })
        .catch(error => {
          console.error('Error al actualizar el empleado', error);
          alert('Error al actualizar el empleado'+ error);
        });
    }
  }

  // Validar los campos antes de guardar o actualizar
  async validateEmployeeFields():Promise<string[]> {
    const errors: string[] = [];
    if (!this.employeModel.firstName || this.employeModel.firstName.trim() === '') {
      errors.push('El primer nombre es obligatorio.');
    } else if (this.employeModel.firstName.length > 50) {
      errors.push('El primer nombre no debe exceder los 50 caracteres.');
    }

    if (!this.employeModel.lastName || this.employeModel.lastName.trim() === '') {
      errors.push('El apellido es obligatorio.');
    } else if (this.employeModel.lastName.length > 50) {
      errors.push('El apellido no debe exceder los 50 caracteres.');
    }

    const maxHoursPerWeek = 7 * 24;
    if (this.employeModel.hoursWorkedPerWeek > maxHoursPerWeek) {
      errors.push(`Las horas trabajadas no pueden exceder ${maxHoursPerWeek} horas por semana.`);
    }

    const today = new Date();
    if (new Date(this.employeModel.dateOfBirth) > today) {
      errors.push('La fecha de nacimiento no puede ser mayor al día de hoy.');
    }

    if (!this.employeModel.rfc || this.employeModel.rfc.trim() === '') {
      errors.push('El RFC es obligatorio.');
    } else if (this.employeModel.rfc.length !== 13) {
      errors.push('El RFC debe tener exactamente 13 caracteres.');
    } else {
      const rfcPattern = /^[A-Z]{4}[0-9]{6}[A-Z]{3}$/;
      if (!rfcPattern.test(this.employeModel.rfc)) {
        errors.push('El RFC tiene un formato incorrecto.');
      }
    }

    if (errors.length === 0 && !this.employeModel.id) {
      const isDuplicate = await this.isRfcDuplicate(this.employeModel.rfc);
      if (isDuplicate) {
        errors.push('Ya existe un empleado con el RFC capturado.');
      }
    }
    return errors;
  }

  async isRfcDuplicate(rfc: string): Promise<boolean> {
    return this.employeeService.checkRfcExists(rfc)
      .then(response => {
        return response
      })
      .catch(error => {
        console.error('Error al verificar el RFC:', error);
        return false;
      });
  }

  // Eliminar un empleado
  onDeleteEmployee(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.employeeService.deleteEmployee(id).then(() => {

        this.employees = this.employees.filter(employee => employee.id !== id);
        alert('Empleado eliminado exitosamente.');

      }).catch(error => {
        console.error('Error al eliminar el empleado:', error);
        alert('Hubo un error al eliminar el empleado.');
      });
    }
  }
}
