import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexMarkers, ApexYAxis, ApexGrid, ApexTitleSubtitle, ApexTooltip, ApexLegend, ApexFill, ApexPlotOptions, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { DashboardData } from '@core/models/dashboard-data.model';
import { DashboardDataService } from '@core/service/dashboard-data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
};
@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        NgbProgressbar,
        NgApexchartsModule,
        NgScrollbar,
    ],
})
export class MainComponent implements OnInit {

  dashboardData: DashboardData = {
    total_users: "0",
    total_clients: "0",
    total_suppliers: "0",
    total_recipes: "0",
    total_usda_ingredients: "0",
    total_custom_ingredients: "0",
    total_projects: "0",
  };
  constructor(private dashboardDataService: DashboardDataService) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.dashboardDataService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      },
    });
  }
}
