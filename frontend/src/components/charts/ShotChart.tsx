import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ShotData } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface ShotChartProps {
  shots: ShotData[];
  title?: string;
  showHeatMap?: boolean;
}

export function ShotChart({ shots, title = 'Shot Chart', showHeatMap = false }: ShotChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || shots.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 500;
    const height = 470;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Basketball court dimensions (half court)
    const courtWidth = 50; // feet
    const courtLength = 47; // feet (half court)

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, courtWidth])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, courtLength])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append('g');

    // Draw court
    drawCourt(g, xScale, yScale, courtWidth, courtLength);

    // Draw shots
    if (showHeatMap) {
      drawHeatMap(g, shots, xScale, yScale);
    } else {
      drawShots(g, shots, xScale, yScale);
    }

  }, [shots, showHeatMap]);

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent className="flex justify-center">
        <svg
          ref={svgRef}
          width="500"
          height="470"
          className="bg-basketball-court/10"
        />
      </CardContent>
    </Card>
  );
}

function drawCourt(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  courtWidth: number,
  courtLength: number
) {
  const lineColor = '#FFFFFF';

  // Outer border
  g.append('rect')
    .attr('x', xScale(0))
    .attr('y', yScale(courtLength))
    .attr('width', xScale(courtWidth) - xScale(0))
    .attr('height', yScale(0) - yScale(courtLength))
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);

  // Paint (key)
  g.append('rect')
    .attr('x', xScale(courtWidth / 2 - 8))
    .attr('y', yScale(19))
    .attr('width', xScale(16) - xScale(0))
    .attr('height', yScale(0) - yScale(19))
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);

  // Free throw circle
  g.append('circle')
    .attr('cx', xScale(courtWidth / 2))
    .attr('cy', yScale(19))
    .attr('r', xScale(6) - xScale(0))
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);

  // Hoop
  g.append('circle')
    .attr('cx', xScale(courtWidth / 2))
    .attr('cy', yScale(5.25))
    .attr('r', 4)
    .attr('fill', 'none')
    .attr('stroke', '#FF6B35')
    .attr('stroke-width', 2);

  // Three-point arc
  const threePointRadius = 23.75;
  const threePointArc = d3.arc()
    .innerRadius(0)
    .outerRadius(xScale(threePointRadius) - xScale(0))
    .startAngle(-Math.PI / 2 - 0.4)
    .endAngle(Math.PI / 2 + 0.4);

  g.append('path')
    .attr('d', threePointArc as any)
    .attr('transform', `translate(${xScale(courtWidth / 2)}, ${yScale(5.25)})`)
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);

  // Three-point line corners
  g.append('line')
    .attr('x1', xScale(3))
    .attr('y1', yScale(0))
    .attr('x2', xScale(3))
    .attr('y2', yScale(14))
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);

  g.append('line')
    .attr('x1', xScale(courtWidth - 3))
    .attr('y1', yScale(0))
    .attr('x2', xScale(courtWidth - 3))
    .attr('y2', yScale(14))
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);
}

function drawShots(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  shots: ShotData[],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
) {
  g.selectAll('circle.shot')
    .data(shots)
    .enter()
    .append('circle')
    .attr('class', 'shot')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', 4)
    .attr('fill', (d) => (d.made ? '#10B981' : '#EF4444'))
    .attr('opacity', 0.6)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .append('title')
    .text((d) => `${d.shotType} - ${d.made ? 'Made' : 'Missed'} (${d.distance}ft)`);
}

function drawHeatMap(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  shots: ShotData[],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
) {
  // Group shots into zones and calculate efficiency
  const zones: { [key: string]: { made: number; total: number } } = {};
  
  shots.forEach((shot) => {
    const zoneX = Math.floor(shot.x / 5) * 5;
    const zoneY = Math.floor(shot.y / 5) * 5;
    const key = `${zoneX},${zoneY}`;
    
    if (!zones[key]) {
      zones[key] = { made: 0, total: 0 };
    }
    
    zones[key].total++;
    if (shot.made) zones[key].made++;
  });

  // Color scale for efficiency
  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
    .domain([0, 1]);

  Object.entries(zones).forEach(([key, value]) => {
    const [x, y] = key.split(',').map(Number);
    const efficiency = value.made / value.total;

    g.append('rect')
      .attr('x', xScale(x))
      .attr('y', yScale(y + 5))
      .attr('width', xScale(5) - xScale(0))
      .attr('height', yScale(0) - yScale(5))
      .attr('fill', colorScale(efficiency))
      .attr('opacity', 0.7)
      .append('title')
      .text(`${(efficiency * 100).toFixed(1)}% (${value.made}/${value.total})`);
  });
}
