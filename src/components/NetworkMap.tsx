
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tractor, 
  Building2, 
  Truck, 
  MapPin,
  Settings
} from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'farmer' | 'buyer' | 'logistics';
  name: string;
  location: [number, number];
  details: {
    crops?: string[];
    demands?: string[];
    services?: string[];
    volume?: string;
    rating?: number;
  };
}

const NetworkMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Sample network data
  const networkNodes: NetworkNode[] = [
    {
      id: 'farmer1',
      type: 'farmer',
      name: 'Rajesh Kumar',
      location: [77.2090, 28.6139], // Delhi area
      details: { crops: ['Wheat', 'Rice'], volume: '500kg', rating: 4.8 }
    },
    {
      id: 'farmer2', 
      type: 'farmer',
      name: 'Priya Sharma',
      location: [75.3412, 31.1471], // Punjab
      details: { crops: ['Rice', 'Maize'], volume: '300kg', rating: 4.6 }
    },
    {
      id: 'buyer1',
      type: 'buyer',
      name: 'Fresh Foods Co.',
      location: [77.1025, 28.7041], // Gurgaon
      details: { demands: ['Premium Wheat', 'Quality Rice'], volume: '2000kg', rating: 4.9 }
    },
    {
      id: 'logistics1',
      type: 'logistics',
      name: 'Regional Transport',
      location: [77.0000, 28.5000],
      details: { services: ['Standard Transport', 'Express Delivery'], rating: 4.7 }
    }
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.0000, 28.5000],
      zoom: 8
    });

    map.current.on('load', () => {
      addNetworkVisualization();
    });
  };

  const addNetworkVisualization = () => {
    if (!map.current) return;

    // Add markers for each node
    networkNodes.forEach(node => {
      const el = document.createElement('div');
      el.className = 'network-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.style.fontWeight = 'bold';
      el.style.color = 'white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      switch (node.type) {
        case 'farmer':
          el.style.backgroundColor = '#22c55e';
          el.innerHTML = '🌾';
          break;
        case 'buyer':
          el.style.backgroundColor = '#3b82f6';
          el.innerHTML = '🏢';
          break;
        case 'logistics':
          el.style.backgroundColor = '#8b5cf6';
          el.innerHTML = '🚚';
          break;
      }

      el.addEventListener('click', () => {
        setSelectedNode(node);
      });

      new mapboxgl.Marker(el)
        .setLngLat(node.location)
        .addTo(map.current!);
    });

    // Add connection lines
    const connections = [
      { from: networkNodes[0], to: networkNodes[2] }, // farmer1 to buyer1
      { from: networkNodes[1], to: networkNodes[2] }, // farmer2 to buyer1
      { from: networkNodes[2], to: networkNodes[3] }, // buyer1 to logistics1
    ];

    connections.forEach((connection, index) => {
      map.current!.addSource(`route${index}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [connection.from.location, connection.to.location]
          }
        }
      });

      map.current!.addLayer({
        id: `route${index}`,
        type: 'line',
        source: `route${index}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#22c55e',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken) {
      setShowTokenInput(false);
      initializeMap();
    }
  };

  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Network Visualization Map
          </CardTitle>
          <CardDescription>
            Enter your Mapbox public token to visualize the AgriLink360 network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={handleTokenSubmit}>
                <Settings className="h-4 w-4 mr-2" />
                Setup Map
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your token from{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                mapbox.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Smart Network Visualization
              </CardTitle>
              <CardDescription>
                AI-powered connections between farmers, buyers, and logistics partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapContainer} className="w-full h-96 rounded-lg" />
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedNode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedNode.type === 'farmer' && <Tractor className="h-5 w-5" />}
                  {selectedNode.type === 'buyer' && <Building2 className="h-5 w-5" />}
                  {selectedNode.type === 'logistics' && <Truck className="h-5 w-5" />}
                  {selectedNode.name}
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline">
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedNode.details.crops && (
                    <div>
                      <p className="font-medium">Crops:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedNode.details.crops.join(', ')}
                      </p>
                    </div>
                  )}
                  {selectedNode.details.demands && (
                    <div>
                      <p className="font-medium">Demands:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedNode.details.demands.join(', ')}
                      </p>
                    </div>
                  )}
                  {selectedNode.details.services && (
                    <div>
                      <p className="font-medium">Services:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedNode.details.services.join(', ')}
                      </p>
                    </div>
                  )}
                  {selectedNode.details.volume && (
                    <div>
                      <p className="font-medium">Volume:</p>
                      <p className="text-sm text-muted-foreground">{selectedNode.details.volume}</p>
                    </div>
                  )}
                  {selectedNode.details.rating && (
                    <div>
                      <p className="font-medium">Rating:</p>
                      <p className="text-sm text-muted-foreground">{selectedNode.details.rating}/5.0</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Network Details</CardTitle>
                <CardDescription>Click on any node to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Farmers ({networkNodes.filter(n => n.type === 'farmer').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Buyers ({networkNodes.filter(n => n.type === 'buyer').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Logistics ({networkNodes.filter(n => n.type === 'logistics').length})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;
