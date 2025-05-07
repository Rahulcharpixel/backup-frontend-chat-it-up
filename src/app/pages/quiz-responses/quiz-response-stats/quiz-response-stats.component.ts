import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-response-stats',
  templateUrl: './quiz-response-stats.component.html',
  styleUrls: ['./quiz-response-stats.component.scss'],
})
export class QuizResponseChartComponent implements OnInit {
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  chart: Chart | undefined
  quizId: string | null = null;

  constructor(private quizService: QuizService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.quizId = paramMap.get("id");
      this.fetchQuizResponseStats();

    });
  }

  fetchQuizResponseStats() {
    if (this.quizId) {
      // console.log(this.quizId);
      this.quizService.getResponseStats(this.quizId).subscribe(
        (response) => {
          console.log("--->>>>re",response.data);
          if (response.success) {
            this.renderChart(response.data);
          }

        },

        (error) => {
          console.error('Error fetching quiz response stats:', error);
        }
      );
    }
  }
  renderChart(data: { name: string; value: number }[]) {
    if (!this.barChartCanvas?.nativeElement) {
      console.error('Chart canvas element not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const backgroundColors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(12, 77, 8, 0.5)'
    ];
    const borderColors = [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(12, 77, 8)'
    ];

    const labels = data.map((d) => d.name);
    const totalResponses = data.reduce((sum, d) => sum + d.value, 0);

    const ctx = this.barChartCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data.map((d) => ((d.value / totalResponses) * 100) || 0),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          barThickness: 20,
          categoryPercentage: 0.8,
          barPercentage: 0.6,
          borderRadius: { topRight: 20, bottomRight: 20 },
          // minBarLength: 50,
        }]

      },

      options: {

        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        indexAxis: 'y',
        layout: {
          padding: { left: 20, right: 30 },
        },

        scales: {
          x: {
            display: true,
            grid: { display: false },
            ticks: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { display: false, font: { size: Math.max(10, window.innerWidth / 50) } }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            fullSize: true,
            labels: {
              usePointStyle: true,
              boxWidth: 12,
              generateLabels: () => {
                // console.log("---->>>>>",data);
                return data.map((d, i) => ({
                  text: d.name,
                  fillStyle: backgroundColors[i],
                  hidden: false,
                  strokeStyle: backgroundColors[i],
                }));
              },



            },


          },

          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.raw.toFixed(2)}%`,
            },
          },
          datalabels: {
            align: 'center',
            color: 'white',
            font: { weight: 'bold', size: 16 },
            formatter: (value: number) => `${value.toFixed(1)}%`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }

}