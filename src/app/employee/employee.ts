import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { Employee } from '../models/employee';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class EmployeeTable implements OnInit {

  public displayedColumns: string[] = ['name', 'lastName', 'document', 'salary', 'gender', 'position', 'startDate'];
  public dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public loadEmployees(): void {
    this.apiService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.dataSource.data = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar los empleados', err);
      }
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}