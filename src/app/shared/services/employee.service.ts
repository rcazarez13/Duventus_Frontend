import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:48104/api/employee';

  constructor(private http: HttpClient) { }

  getEmployees(): Promise<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).toPromise();
  }

  createEmployee(employee: Employee): Promise<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).toPromise();
  }

  updateEmployee(employee: Employee): Promise<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}`, employee).toPromise();
  }

  deleteEmployee(id: number): Promise<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).toPromise();
  }

  checkRfcExists(rfc: string): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/exist-rfc/${rfc}`).toPromise();
  }

}
