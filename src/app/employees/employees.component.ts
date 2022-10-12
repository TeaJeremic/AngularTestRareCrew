import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../interfaces/employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})


export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  data: any;

  chartOptions: any;
 
  labelData: any[] = [];
  valueData: number[] = [];
  options: any;


  constructor ( private httpClient: HttpClient ) { }

  ngOnInit(): void {

    this.getEmployees();
   
  }

  getEmployees() {
    this.httpClient.get<any>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==').subscribe(

      (res: Employee[]) => {
        console.log('podaci', res);
    
        res.forEach(element => {
          if (element.EmployeeName != undefined) {

            if (this.employees.every(x => x.EmployeeName != element.EmployeeName)) {
              element.WorkingHours = 0;
              this.employees.push(element);        
            }

            else {

              let startTime: Date = new Date(element.StarTimeUtc);
              let endTime: Date = new Date(element.EndTimeUtc);
             
              let hours: number = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24))
           
              let x: any = this.employees.find(x => x.EmployeeName == element.EmployeeName);
              x.WorkingHours += hours;
                    
              this.sortHours();
            }
          }
        });

        this.employees.forEach(employee => {
          let pie_data = { name: employee.EmployeeName, value: employee.WorkingHours };     
          this.labelData.push(pie_data.name);
          this.valueData.push(pie_data.value);

          const totalHours: number[] = this.valueData;
          console.log("totalHours", totalHours);


          let sum = totalHours.reduce((acc, el) => acc += el);

          const final = totalHours.map(el => {
            let res = el * 100 / sum;
            return res.toFixed(2);
          });
        
          console.log(final); 


          this.data = {
            labels: this.labelData,
            datasets: [
              {
                data: final,
                backgroundColor: [
                  "#F66D44",
                  "#FEAE65",
                  "#E6F69D",
                  "#AADEA7",
                  "#64C2A6",
                  "#2D87BB",
                  "#F7B7A3",
                  "#EA5F89",
                  "#9B3192",
                  "#57167E"
                ]
              },
            ]
          };
          this.chartOptions = {      
            legend: {
              position: 'bottom'
            }
          };
        })
      }
    );
  }


  sortHours() {
    let sorted: { WorkingHours: number; }[] = this.employees.sort((n1, n2) => {
      if (n1.WorkingHours < n2.WorkingHours) {
        return 1;
      }

      if (n1.WorkingHours > n2.WorkingHours) {
        return -1;
      }

      return 0;
    });

  
  }
}
