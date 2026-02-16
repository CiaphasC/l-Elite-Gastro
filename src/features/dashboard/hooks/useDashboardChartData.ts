import { useMemo } from "react";
import type { DashboardSnapshot } from "@/types";

const LINE_CHART_WIDTH = 760;
const LINE_CHART_HEIGHT = 300;
const LINE_PADDING_X = 28;
const LINE_PADDING_TOP = 20;
const LINE_PADDING_BOTTOM = 48;

const BAR_CHART_WIDTH = 520;
const BAR_CHART_HEIGHT = 240;
const BAR_PADDING_X = 26;
const BAR_PADDING_TOP = 18;
const BAR_PADDING_BOTTOM = 44;

const DONUT_RADIUS = 76;
const DONUT_STROKE = 14;
const DONUT_SIZE = 220;

interface WeeklyChartPoint {
  label: string;
  amount: number;
  x: number;
  y: number;
}

interface BarChartPoint {
  label: string;
  amount: number;
  x: number;
  y: number;
  barHeight: number;
}

interface ChartGuide {
  key: string;
  y: number;
}

interface DonutSegment {
  label: string;
  amount: number;
  color: string;
  percent: number;
  strokeLength: number;
  strokeOffset: number;
}

export const useDashboardChartData = (snapshot: DashboardSnapshot) =>
  useMemo(() => {
    const weeklyAmounts = snapshot.weeklyPerformance.map((point) => point.amount);

    const lineUsableHeight = LINE_CHART_HEIGHT - LINE_PADDING_TOP - LINE_PADDING_BOTTOM;
    const lineUsableWidth = LINE_CHART_WIDTH - LINE_PADDING_X * 2;
    const maxWeeklyAmount = Math.max(...weeklyAmounts, 1);
    const minWeeklyAmount = Math.min(...weeklyAmounts, 0);
    const amountRange = Math.max(maxWeeklyAmount - minWeeklyAmount, maxWeeklyAmount * 0.35, 1);
    const pointsCount = Math.max(snapshot.weeklyPerformance.length - 1, 1);

    const linePoints: WeeklyChartPoint[] = snapshot.weeklyPerformance.map((point, index) => {
      const x = LINE_PADDING_X + (lineUsableWidth / pointsCount) * index;
      const relativeValue = (point.amount - minWeeklyAmount) / amountRange;
      const y = LINE_PADDING_TOP + lineUsableHeight - relativeValue * lineUsableHeight;

      return { ...point, x, y };
    });

    const linePath = linePoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath =
      linePoints.length > 0
        ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${LINE_PADDING_TOP + lineUsableHeight} L ${linePoints[0].x} ${LINE_PADDING_TOP + lineUsableHeight} Z`
        : "";

    const horizontalGuides: ChartGuide[] = Array.from({ length: 4 }, (_, index) => ({
      key: `guide-${index}`,
      y: LINE_PADDING_TOP + (lineUsableHeight / 3) * index,
    }));

    const barUsableHeight = BAR_CHART_HEIGHT - BAR_PADDING_TOP - BAR_PADDING_BOTTOM;
    const barUsableWidth = BAR_CHART_WIDTH - BAR_PADDING_X * 2;
    const barCount = Math.max(snapshot.weeklyPerformance.length, 1);
    const barSlot = barUsableWidth / barCount;
    const barWidth = Math.max(Math.min(barSlot * 0.56, 42), 18);
    const maxBarAmount = Math.max(...weeklyAmounts, 1);

    const barGuides: ChartGuide[] = Array.from({ length: 4 }, (_, index) => ({
      key: `bar-guide-${index}`,
      y: BAR_PADDING_TOP + (barUsableHeight / 3) * index,
    }));

    const bars: BarChartPoint[] = snapshot.weeklyPerformance.map((point, index) => {
      const cleanAmount = Math.max(point.amount, 0);
      const barHeight = (cleanAmount / maxBarAmount) * barUsableHeight;
      const xCenter = BAR_PADDING_X + barSlot * index + barSlot / 2;
      return {
        ...point,
        x: xCenter - barWidth / 2,
        y: BAR_PADDING_TOP + barUsableHeight - barHeight,
        barHeight,
      };
    });

    const peakDay =
      snapshot.weeklyPerformance.reduce(
        (best, point) => (point.amount > best.amount ? point : best),
        snapshot.weeklyPerformance[0] ?? { label: "-", amount: 0 }
      ) ?? { label: "-", amount: 0 };

    const daySales = Math.max(snapshot.salesByPeriod.day, 0);
    const weekRemainder = Math.max(snapshot.salesByPeriod.week - snapshot.salesByPeriod.day, 0);
    const monthRemainder = Math.max(snapshot.salesByPeriod.month - snapshot.salesByPeriod.week, 0);
    const periodDistribution = [
      { label: "Hoy", amount: daySales, color: "#22D3EE" },
      { label: "Resto Semana", amount: weekRemainder, color: "#3B82F6" },
      { label: "Resto Mes", amount: monthRemainder, color: "#F59E0B" },
    ];
    const distributionTotal = periodDistribution.reduce((sum, segment) => sum + segment.amount, 0);
    const donutCenter = DONUT_SIZE / 2;
    const donutCircumference = 2 * Math.PI * DONUT_RADIUS;

    let currentOffset = 0;
    const donutSegments: DonutSegment[] = periodDistribution.map((segment) => {
      const ratio = distributionTotal > 0 ? segment.amount / distributionTotal : 0;
      const strokeLength = ratio * donutCircumference;
      const computedSegment = {
        ...segment,
        percent: ratio * 100,
        strokeLength,
        strokeOffset: currentOffset,
      };
      currentOffset += strokeLength;
      return computedSegment;
    });

    return {
      lineChart: {
        width: LINE_CHART_WIDTH,
        height: LINE_CHART_HEIGHT,
        paddingX: LINE_PADDING_X,
        paddingTop: LINE_PADDING_TOP,
        usableHeight: lineUsableHeight,
        horizontalGuides,
        points: linePoints,
        linePath,
        areaPath,
      },
      barChart: {
        width: BAR_CHART_WIDTH,
        height: BAR_CHART_HEIGHT,
        paddingX: BAR_PADDING_X,
        barWidth,
        guides: barGuides,
        bars,
      },
      donutChart: {
        size: DONUT_SIZE,
        center: donutCenter,
        radius: DONUT_RADIUS,
        stroke: DONUT_STROKE,
        circumference: donutCircumference,
        segments: donutSegments,
      },
      peakDay,
    };
  }, [snapshot]);
