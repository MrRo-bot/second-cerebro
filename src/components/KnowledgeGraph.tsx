"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ForceGraphMethods } from "react-force-graph-3d";

import { GraphLink, GraphNode } from "@/types/ai";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

const KnowledgeGraph = ({
  graphData,
}: {
  graphData: { nodes: GraphNode[]; links: GraphLink[] };
}) => {
  const fgRef = useRef<ForceGraphMethods | null>(null);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const timeout = setTimeout(() => {
        fgRef.current?.zoomToFit(400, 100);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [graphData]);

  return (
    <>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="name"
        nodeColor={(node: GraphNode) =>
          node.type === "tag" ? "#facc15" : "#60a5fa"
        }
        linkColor={(link: GraphLink) =>
          link.type === "tag" ? "#22c55e" : "#a78bfa"
        }
        linkDirectionalParticles="value"
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}
        linkDirectionalParticleResolution={100}
        linkWidth={(link: GraphLink) => Math.max(1, link.value * 2)}
        nodeRelSize={6}
        enableNodeDrag={true}
        enableNavigationControls={true}
        onNodeClick={(node: GraphNode) => {
          if (node.type === "note") {
            redirect(`/dashboard/${node.id}`);
          }
        }}
        // 3D specific options
        backgroundColor="#09090b"
        showNavInfo={false}
      />
      {/* Optional Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Fit View
        </button>
      </div>
    </>
  );
};

export default KnowledgeGraph;
