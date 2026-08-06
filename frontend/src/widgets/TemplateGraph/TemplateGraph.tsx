import { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, GraphNode } from '../../entities/template/types';

interface Props {
  data: GraphData;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateGraph({ data, selectedId, onSelect }: Props) {
  const fgRef = useRef<any>(null);

  // Center the graph on mount/data change
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => fgRef.current?.zoomToFit(400, 80), 300);
    }
  }, [data]);

  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = node.id === selectedId;
    const r = isSelected ? 7 : 5;

    // Glow for selected node
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, r + 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
    }

    // Node body
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? '#ffffff' : (node.color as string);
    ctx.fill();

    // Constant screen size for text: e.g., 10px on screen
    const baseFontSize = isSelected ? 12 : 10;
    const fontSize = baseFontSize / globalScale;
    
    ctx.font = `${isSelected ? 600 : 400} ${fontSize}px Geist Sans, sans-serif`;
    ctx.fillStyle = isSelected ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(node.name, node.x!, node.y! + r + (4 / globalScale));
  }, [selectedId]);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      backgroundColor="transparent"
      nodeCanvasObject={paintNode as any}
      nodeCanvasObjectMode={() => 'replace'}
      linkColor={() => 'rgba(255,255,255,0.08)'}
      linkWidth={1}
      onNodeClick={(node: any) => onSelect(node.id)}
      cooldownTicks={100}
      nodeRelSize={5}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
    />
  );
}
