import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

interface Threat {
  id: number | string;
  lat: number;
  lng: number;
  country: string;
  countryCode?: string;
  attackType: string;
  severity: string;
  blocked: boolean;
  attackerIp?: string;
  targetIp?: string;
  targetCountry?: string;
  targetCountryCode?: string;
  targetLat?: number;
  targetLng?: number;
  timestamp?: string;
}

interface ThreatGlobeProps {
  threats: Threat[];
  onThreatSelect?: (threat: Threat | null) => void;
}

const GlobeMarker = ({ position, color, label, onClick }: { position: [number, number, number], color: string, label?: string, onClick?: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar((hovered ? 1.5 : 1) + Math.sin(clock.getElapsedTime() * 2) * 0.2);
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1 : 0.5} />
      </mesh>
      {(hovered || label) && (
        <Text
          position={[position[0], position[1] + 0.1, position[2]]}
          fontSize={0.05}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const ThreatPath = ({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) => {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2 * 1.5,
        (start[1] + end[1]) / 2 * 1.5,
        (start[2] + end[2]) / 2 * 1.5
      ),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end]);

  return <Line points={points} color={color} lineWidth={1} opacity={0.6} transparent />;
};

const Globe = ({ threats, onThreatSelect }: { threats: Threat[], onThreatSelect?: (threat: Threat) => void }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const latLngToVector3 = (lat: number, lng: number, radius: number = 1): [number, number, number] => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return [x, y, z];
  };

  const recentThreats = threats.slice(0, 100);

  return (
    <group>
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#0a1929"
          emissive="#1e3a5f"
          emissiveIntensity={0.2}
          wireframe={false}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      <Sphere args={[1.01, 64, 64]}>
        <meshBasicMaterial color="#0ea5e9" wireframe opacity={0.1} transparent />
      </Sphere>

      {recentThreats.map((threat, index) => {
        const position = latLngToVector3(threat.lat, threat.lng, 1.02);
        const color = threat.blocked ? '#22c55e' : threat.severity === 'Critical' ? '#ef4444' : threat.severity === 'High' ? '#f97316' : '#eab308';
        
        const targetPosition = threat.targetLat && threat.targetLng 
          ? latLngToVector3(threat.targetLat, threat.targetLng, 1.02)
          : latLngToVector3(Math.random() * 180 - 90, Math.random() * 360 - 180, 1.02);

        return (
          <React.Fragment key={threat.id || index}>
            <GlobeMarker 
              position={position} 
              color={color} 
              label={threat.country}
              onClick={() => onThreatSelect?.(threat)}
            />
            <ThreatPath start={position} end={targetPosition} color={color} />
          </React.Fragment>
        );
      })}
    </group>
  );
};

export const ThreatGlobe: React.FC<ThreatGlobeProps> = ({ threats, onThreatSelect }) => {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [zoomLevel, setZoomLevel] = useState(3);

  const handleThreatSelect = (threat: Threat) => {
    setSelectedThreat(threat);
    onThreatSelect?.(threat);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.max(1.5, prev - 0.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.min(10, prev + 0.5));
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, zoomLevel], fov: 45 }} key={zoomLevel}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Globe threats={threats} onThreatSelect={handleThreatSelect} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            onClick={handleZoomIn}
            size="icon"
            className="bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600"
          >
            +
          </Button>
          <Button
            onClick={handleZoomOut}
            size="icon"
            className="bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600"
          >
            −
          </Button>
        </div>
      </div>
      
      {selectedThreat && (
        <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">Threat Details</h3>
            <button 
              onClick={() => setSelectedThreat(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-red-400">Attacker Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address:</span>
                  <span className="text-white font-mono">{selectedThreat.attackerIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white">{selectedThreat.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{selectedThreat.lat?.toFixed(4)}, {selectedThreat.lng?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Attack Type:</span>
                  <span className="text-yellow-400">{selectedThreat.attackType}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-blue-400">Target Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address:</span>
                  <span className="text-white font-mono">{selectedThreat.targetIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white">{selectedThreat.targetCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{selectedThreat.targetLat?.toFixed(4)}, {selectedThreat.targetLng?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={selectedThreat.blocked ? "text-green-400" : "text-red-400"}>
                    {selectedThreat.blocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Severity:</span>
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  selectedThreat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  selectedThreat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  selectedThreat.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {selectedThreat.severity}
                </span>
              </div>
              <div className="text-gray-400">
                {selectedThreat.timestamp && new Date(selectedThreat.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
