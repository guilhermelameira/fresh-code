import React, { Component } from ‘react’;
import ‘../App.css’;
import * as am4core from “@amcharts/amcharts4/core”;
import * as am4charts from “@amcharts/amcharts4/charts”;
import am4themes_animated from “@amcharts/amcharts4/themes/animated”;
import { ChartProps, ChartDataNode, ChartDataBranch, ChartDataLeaf, isBranch, isLeaf } from ‘../types/ChartTypes’;
am4core.useTheme(am4themes_animated);
// Internal Types
type ExtendedChartDataNode = (ExtendedChartDataBranch | ExtendedChartDataLeaf);
interface ExtendedChartDataBranch extends ChartDataBranch {
    color?: string;
    data?: { infoString?: string; image?: string; };
}
interface ExtendedChartDataLeaf extends ChartDataLeaf {
    color?: string;
    data?: { infoString?: string; image?: string; };
}
function isExtendedBranch(node: ExtendedChartDataNode): node is ExtendedChartDataBranch {
    return isBranch(node as ChartDataNode);
}
const MIN_SIZE = 5;
class Chart extends Component<ChartProps> {
    chart?: am4charts.TreeMap;
    componentDidMount() {
        let chart = am4core.create(“chartdiv”, am4charts.TreeMap);
        let { repo } = this.props;
        this.configDataFields(chart);
        let levelSeriesTemplates = this.generateLevelSeriesTemplates(chart);
        this.configHeatLegend(chart, repo);
        this.configChartStyling(chart, levelSeriesTemplates);
        this.configElementText(levelSeriesTemplates);
        this.configElementTooltip(levelSeriesTemplates);
        this.configElementBgImage(levelSeriesTemplates);
        chart.data = this.getData(repo);
        chart.maxLevels = 1; // only one level visible initially
        this.chart = chart;
    }
    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    private configHeatLegend(chart: am4charts.TreeMap, repo: ExtendedChartDataNode): void {
        let heatLegend = chart.createChild(am4charts.HeatLegend);
        heatLegend.minColor = am4core.color(this.getColor(0));
        heatLegend.maxColor = am4core.color(this.getColor(1));
        let { min, max } = this.getMinMaxHeat(repo);
        heatLegend.minValue = min;
        heatLegend.maxValue = max;
        heatLegend.width = am4core.percent(80);
        heatLegend.align = “center”;
        heatLegend.margin(10, 10, 10, 10);
    }
    private configDataFields(chart: am4charts.TreeMap): void {
        chart.dataFields.value = “size”;
        chart.dataFields.name = “name”;
        chart.dataFields.children = “children”;
        chart.dataFields.color = “color”;
        chart.dataFields.data = “data”;
    }
    private configElementText(levelSeriesTemplates: am4charts.TreeMapSeries[]): void {
        levelSeriesTemplates.forEach((levelSeriesTemplate: am4charts.TreeMapSeries) => {
            let bullet = levelSeriesTemplate.bullets.push(new am4charts.LabelBullet());
            bullet.locationX = 0.5;
            bullet.locationY = 0.5;
            bullet.label.text = `{name}`;
            bullet.label.fill = am4core.color(“white”);
        });
    }
    private configElementTooltip(levelSeriesTemplates: am4charts.TreeMapSeries[]): void {
        levelSeriesTemplates.forEach((levelSeriesTemplate: am4charts.TreeMapSeries) => {
            levelSeriesTemplate.columns.template.tooltipText = “Name: {name}\n{data.infoString}“;
        });
    }
    private configElementBgImage(levelSeriesTemplates: am4charts.TreeMapSeries[]): void {
        levelSeriesTemplates.forEach((levelSeriesTemplate: am4charts.TreeMapSeries) => {
            let image = levelSeriesTemplate.columns.template.createChild(
                am4core.Image
            );
            image.opacity = 0.04;
            image.align = “center”;
            image.valign = “middle”;
            image.width = am4core.percent(80);
            image.height = am4core.percent(80);
            image.adapter.add(“href”, (href, target) => {
                let dataItem = (target.parent as any).dataItem;
                if (dataItem) {
                    return dataItem.treeMapDataItem.data.image;
                }
            });
        });
    }
    private configChartStyling(chart: am4charts.TreeMap, levelSeriesTemplates: am4charts.TreeMapSeries[]): void {
        levelSeriesTemplates.forEach((levelSeriesTemplate: am4charts.TreeMapSeries) => {
            levelSeriesTemplate.columns.template.strokeWidth = 10;
            levelSeriesTemplate.columns.template.stroke = am4core.color(“white”);
            levelSeriesTemplate.columns.template.column.cornerRadius(10, 10, 10, 10);
            levelSeriesTemplate.columns.template.strokeOpacity = 1;
            levelSeriesTemplate.columns.template.margin(100, 100, 10, 10);
        });
        chart.layoutAlgorithm = chart.squarify;
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart.padding(0, 0, 0, 0);
        chart.navigationBar = new am4charts.NavigationBar();
    }
    private generateLevelSeriesTemplates(chart: am4charts.TreeMap): am4charts.TreeMapSeries[] {
        let levelSeriesTemplates: am4charts.TreeMapSeries[] = [];
        let depth = this.getDepth(this.props.repo);
        for (let level = 0; level < depth; level++) {
            levelSeriesTemplates.push(chart.seriesTemplates.create(`${level}`));
        }
        return levelSeriesTemplates;
    }
    private getData(repo: ExtendedChartDataNode) {
        let data = this.scaleSize(this.setAdditionalFields(this.setColors(repo)))
        console.log(data);
        return [data];
    }
    private scaleSize(repo: ExtendedChartDataNode): ExtendedChartDataNode {
        let helper = (node: ExtendedChartDataNode) => {
            if (!isExtendedBranch(node) &&  node.size) {
                node.size = Math.max(Math.log(node.size+1), MIN_SIZE);
            }
            if (isExtendedBranch(node)) {
                node.children.forEach(helper);
            }
        }
        helper(repo);
        return repo;
    }
    private setColors(repo: ExtendedChartDataNode): ExtendedChartDataNode {
        let { min, max } = this.getMinMaxHeat(repo);
        let setColor = (node: ExtendedChartDataNode) => {
            if (node.heat) {
                node.color = this.getColor((node.heat - min) / (max - min));
            }
            if (isExtendedBranch(node)) {
                node.children.forEach(setColor);
            }
        };
        setColor(repo);
        return repo;
    }
    private setAdditionalFields(node: ExtendedChartDataNode): ExtendedChartDataNode {
        if (isExtendedBranch(node)) {
            node.children.forEach(this.setAdditionalFields.bind(this));
        }
        if (node.info) {
            let image = node.image;
            let infoString = node.info.map(({ name, value }) => `${name}: ${value}`).join(“\n”);
            node.data = { infoString, image }
        }
        return node;
    }
    private getMinMaxHeat(repo: ExtendedChartDataNode): { min: number; max: number; } {
        let min = Infinity;
        let max = 0;
        let helper = (node: ExtendedChartDataNode) => {
            let val = node.heat;
            if (val) {
                if (max === undefined || val > max) max = val;
                if (min === undefined || val < min) min = val;
            }
            if (isExtendedBranch(node)) {
                node.children.forEach(helper);
            }
        }
        helper(repo);
        return { min, max };
    }
    private getDepth(node: ExtendedChartDataNode): number {
        if (isExtendedBranch(node)) {
            return Math.max(...(node.children.map(this.getDepth.bind(this)))) + 1;
        } else {
            return 1;
        }
    }
    private getColor(ratio: number): string {
        // Brown to green
        return `rgb(100,${Math.floor((1 - ratio) * 200) + 55},0)`;
        // Red to green
        // if (percentage > .5) {
        //     let g = Math.floor((percentage - .5) * 2 * 255);
        //     let r = Math.floor(255 - g);
        //     return `rgb(${r},${g},0)`;
        // } else {
        //     let r = Math.floor((.5 - percentage) * 2 * 255);
        //     let g = Math.floor(255 - r);
        //     return `rgb(${r},${g},0)`;
        // }
    }
    render() {
        return (
            <div id=“chartdiv” style={{ width: “100%“, height: “100%” }}></div>
        );
    }
}
