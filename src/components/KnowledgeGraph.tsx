"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import type { ForceGraphMethods } from "react-force-graph-3d";
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";

import { GraphLink, GraphNode } from "@/types/ai";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

const colorScale = scaleOrdinal(schemeTableau10);

const KnowledgeGraph = ({
  graphData,
}: {
  graphData: { nodes: GraphNode[]; links: GraphLink[] };
}) => {
  const fgRef = useRef<ForceGraphMethods | null>(null);

  const { theme } = useTheme();

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
        nodeColor={(d: GraphNode) => colorScale(String(d.type).toLowerCase())}
        nodeRelSize={3}
        enableNodeDrag={true}
        onNodeClick={(node: GraphNode) => {
          if (node.type === "note") {
            redirect(`/dashboard/${node.id}`);
          }
        }}
        enableNavigationControls={true}
        // 3D specific options
        backgroundColor={theme === "dark" ? "#09090b" : "#eeeeee"}
        showNavInfo={false}
        linkDirectionalParticles="value"
        linkColor={(link: GraphLink) => {
          // Get the type from the source node
          const sourceType =
            typeof link.source === "object"
              ? (link.source as GraphNode).type
              : graphData.nodes.find((n) => n.id === link.source)?.type;

          return sourceType
            ? colorScale(String(sourceType).toLowerCase())
            : "#ffffff";
        }}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}
        linkDirectionalParticleResolution={100}
        linkWidth={(link: GraphLink) => Math.max(1, link.value * 1.5)}
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
