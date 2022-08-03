import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils/layout.service';


@Component({
  selector: 'ngx-visitors-statistics',
  styleUrls: ['./visitors-statistics.component.scss'],
  templateUrl: './visitors-statistics.component.html',
})
export class ECommerceVisitorsStatisticsComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  @Input() value: number | undefined;

  option: any = {};
  chartLegend: any | undefined;
  echartsIntance: any;

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const variables: any = config.variables;
        const visitorsPieLegend: any = config.variables?.visitorsPieLegend;

        this.setOptions(variables);
        this.setLegendItems(visitorsPieLegend);
    });
  }

  setLegendItems(visitorsPieLegend: { firstSection: any; secondSection: any; }) {
    this.chartLegend = [
      {
        iconColor: visitorsPieLegend.firstSection,
        title: 'New Visitors',
      },
      {
        iconColor: visitorsPieLegend.secondSection,
        title: 'Return Visitors',
      },
    ];
  }

  setOptions(variables: { visitorsPie: any; fontSecondary: any; fgHeading: any; layoutBg: any; }) {
    const visitorsPie: any = variables.visitorsPie;

    this.option = {
      tooltip: {
        trigger: 'item',
        formatter: '',
      },
      series: [
        {
          name: ' ',
          clockWise: true,
          hoverAnimation: false,
          type: 'pie',
          center: ['50%', '50%'],
          radius: visitorsPie.firstPieRadius,
          data: [
            {
              value: this.value,
              name: ' ',
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: visitorsPie.firstPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: visitorsPie.firstPieGradientRight,
                    },
                  ]),
                  shadowColor: visitorsPie.firstPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
              hoverAnimation: false,
            },
            {
              value: 100 - 20,
              name: ' ',
              tooltip: {
                show: false,
              },
              label: {
                normal: {
                  position: 'inner',
                },
              },
              itemStyle: {
                normal: {
                  color: variables.layoutBg,
                },
              },
            },
          ],
        },
        {
          name: ' ',
          clockWise: true,
          hoverAnimation: false,
          type: 'pie',
          center: ['50%', '50%'],
          radius: visitorsPie.secondPieRadius,
          data: [
            {
              value: this.value,
              name: ' ',
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1),
                },
              },
              hoverAnimation: false,
            },
            {
              value: 100 - 10,
              name: ' ',
              tooltip: {
                show: false,
              },
              label: {
                normal: {
                  position: 'inner',
                },
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: visitorsPie.secondPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: visitorsPie.secondPieGradientRight,
                    },
                  ]),
                  shadowColor: visitorsPie.secondPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: visitorsPie.shadowOffsetX,
                  shadowOffsetY: visitorsPie.shadowOffsetY,
                },
              },
            },
          ],
        },
      ],
    };
  }

  onChartInit(echarts: any) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
