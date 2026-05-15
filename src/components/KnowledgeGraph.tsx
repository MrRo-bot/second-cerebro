"use client";

import { GraphLink, GraphNode } from "@/types/ai";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDownLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react";

// Import the base types from the library
import type {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-3d";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Cast the dynamic component to any to bypass the strict ref-mismatch check
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

const KnowledgeGraph = ({
  graphData,
}: {
  graphData: { nodes: NodeObject[]; links: LinkObject[] };
}) => {
  // 1. Use the base library types for the Ref
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const bloomInitialized = useRef(false);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  //canvas resize based on resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  //zoom to fit
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
        const composer = fgRef.current.postProcessingComposer();
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.5,
          0.3,
          0,
        );
        composer.addPass(bloomPass);
        bloomInitialized.current = true;
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // click to focus
  const handleClick = (node: GraphNode) => {
    const { x, y, z } = node;

    if (
      typeof x === "number" &&
      typeof y === "number" &&
      typeof z === "number"
    ) {
      if (!fgRef.current) return;

      const distance = 60;
      const distRatio = 1 + distance / (Math.hypot(x, y, z) || 1);

      fgRef.current.cameraPosition(
        { x: x * distRatio, y: y * distRatio, z: z * distRatio },
        { x, y, z },
        2000,
      );
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        showNavInfo={true}
        backgroundColor="#000"
        nodeLabel="name"
        nodeAutoColorBy="name"
        linkAutoColorBy="source"
        nodeRelSize={3}
        enableNodeDrag={true}
        onNodeClick={handleClick}
        linkDirectionalParticles="value"
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={(d: GraphLink) => (d.value || 0) * 0.01}
        linkWidth={(link: GraphLink) => Math.max(1, (link.value || 0) * 1.5)}
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="relative bg-gray-400/15 hover:bg-gray-400/30 text-white aspect-square size-8 rounded-full text-sm transition cursor-pointer"
        >
          <ArrowDownLeftIcon
            weight="bold"
            className="size-3 absolute top-1.25 right-1.25"
          />
          <ArrowUpRightIcon
            weight="bold"
            className="size-3 absolute bottom-1.25 left-1.25"
          />
        </Button>
      </div>
      <Badge
        role="stats"
        variant="secondary"
        className="absolute bottom-4 left-4 flex gap-2 text-sm rounded-full font-light items-center justify-center px-2 py-4 bg-gray-400/15 text-white"
      >
        <strong className="font-extrabold font-heading">
          {graphData.nodes.length}
        </strong>{" "}
        <p className="pt-1">node/s •</p>
        <strong className="font-extrabold font-heading">
          {graphData.links.length}
        </strong>{" "}
        <p className="pt-1">link/s •</p>
        <strong className="font-extrabold font-heading">
          {[...new Set(graphData.nodes.map((n) => n.group))].length}
        </strong>{" "}
        <p className="pt-1">Group/s</p>
      </Badge>
    </div>
  );
};

export default KnowledgeGraph;
