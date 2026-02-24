/**
 * API route to load agent system data
 * This runs on the server where Node.js fs module is available
 */

import { NextResponse } from 'next/server';
import { dataLoader } from '@/lib/services/DataLoader';
import { graphBuilder } from '@/lib/services/GraphBuilder';
import { logger } from '@/lib/utils/logger';

export async function GET() {
  try {
    logger.info('api', 'Received request to load agent system data');

    // Load data
    const data = await dataLoader.loadAll();

    // Build graph
    const graph = graphBuilder.build(data);
    const stats = graphBuilder.getStats(graph);

    // Debug: log node counts
    const nodesArray = Array.from(graph.nodes.values());
    logger.info('api', `Graph stats: ${graph.nodes.size} nodes in Map, ${nodesArray.length} in array`);
    logger.info('api', 'Request completed successfully', stats);

    return NextResponse.json({
      success: true,
      data,
      graph: {
        nodes: nodesArray,
        edges: graph.edges,
      },
      stats,
      logs: logger.getFilteredLogs({ level: 'warn' }).concat(
        logger.getFilteredLogs({ level: 'error' })
      ), // Include warnings and errors
    });
  } catch (error) {
    logger.error('api', 'Request failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
        logs: logger.getLogs(), // Include all logs on error
      },
      { status: 500 }
    );
  }
}
