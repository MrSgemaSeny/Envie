import { Template, GraphData, GraphNode, GraphLink } from '../types';

const GROUP_COLORS: Record<string, string> = {
  EPIC:    'rgba(250,250,250,0.9)',
  AI:      'rgba(250,250,250,0.6)',
  STYLE:   'rgba(250,250,250,0.5)',
  PROJECT: 'rgba(250,250,250,0.7)',
  DEFAULT: 'rgba(250,250,250,0.4)',
};

export function buildGraph(templates: Template[]): GraphData {
  const nodes: GraphNode[] = templates.map(t => {
    const group = t.name.includes('_')
      ? t.name.split('_')[0].toUpperCase()
      : t.name.replace('.md', '').toUpperCase();

    return {
      id: t.name,
      name: t.name.replace('.md', ''),
      group,
      updatedAt: t.updatedAt,
      val: 1,
      color: GROUP_COLORS[group] ?? GROUP_COLORS.DEFAULT,
    };
  });

  const links: GraphLink[] = [];
  const byGroup = nodes.reduce((acc, node) => {
    if (!acc[node.group]) acc[node.group] = [];
    acc[node.group].push(node.id);
    return acc;
  }, {} as Record<string, string[]>);

  Object.values(byGroup).forEach(group => {
    for (let i = 0; i < group.length - 1; i++) {
      links.push({ source: group[i], target: group[i + 1] });
    }
  });

  // Find ENVIE.md to use as the central hub of the project
  const rootNode = nodes.find(n => n.id === 'ENVIE.md');

  // Handle loners (files with no links) by tying them to ENVIE.md
  // This creates the "spiderweb" effect with ENVIE in the center
  const loners = nodes.filter(n =>
    n.id !== 'ENVIE.md' && !links.some(l => l.source === n.id || l.target === n.id)
  );

  if (rootNode && loners.length > 0) {
    loners.forEach(loner => {
      links.push({ source: rootNode.id, target: loner.id });
    });
  }

  return { nodes, links };
}
