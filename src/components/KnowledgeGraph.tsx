"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

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
  const bloomInitialized = useRef(false);

  //fit to view
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const timeout = setTimeout(() => {
        fgRef.current?.zoomToFit(400, 100);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [graphData]);

  //bloom effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (fgRef.current && !bloomInitialized.current) {
        const fg = fgRef.current;
        const composer = fg.postProcessingComposer();

        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1, // Strength
          0.3, // Radius (Lower = Sharper, less foggy)
          0, // Threshold (Higher = Darker background)
        );
        composer.addPass(bloomPass);
        bloomInitialized.current = true;
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  //Click to Focus
  const handleClick = (node: GraphNode) => {
    if (node.x && node.y && node.z) {
      if (!node || !fgRef.current) return;

      const distance = 60;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node, // lookAt node
        2000, // ms transition
      );
    }
  };

  return (
    <>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#000"
        nodeLabel="name"
        //TODO:auto color needs more defined categories
        nodeAutoColorBy="name"
        linkAutoColorBy="source"
        nodeRelSize={3}
        enableNodeDrag={true}
        //focus goes towards the node
        onNodeClick={handleClick}
        enableNavigationControls={true}
        showNavInfo={false}
        linkDirectionalParticles="value"
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}
        linkDirectionalParticleResolution={100}
        linkWidth={(link: GraphLink) => Math.max(1, link.value * 1.5)}
      />
      {/* Optional Controls */}
      <div className="absolute top-4 right-4 flex gap-2 flex-col">
        <button
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
        >
          Fit View
        </button>
      </div>
    </>
  );
};

export default KnowledgeGraph;
