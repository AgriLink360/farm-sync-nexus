import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tractor, 
  Building2, 
  Truck, 
  MapPin
} from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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
  const map = useRef<L.Map | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Sample network data - Indian locations
  const networkNodes: NetworkNode[] = [
    {
      id: 'farmer1',
      type: 'farmer',
      name: 'Rajesh Kumar',
      location: [28.6139, 77.2090], // Delhi area (lat, lng for Leaflet)
      details: { crops: ['Wheat', 'Rice'], volume: '500kg', rating: 4.8 }
    },
    {
      id: 'farmer2', 
      type: 'farmer',
      name: 'Priya Sharma',
      location: [31.1471, 75.3412], // Punjab
      details: { crops: ['Rice', 'Maize'], volume: '300kg', rating: 4.6 }
    },
    {
      id: 'farmer3',
      type: 'farmer', 
      name: 'Amit Singh',
      location: [26.9124, 75.7873], // Rajasthan
      details: { crops: ['Cotton', 'Wheat'], volume: '800kg', rating: 4.5 }
    },
    {
      id: 'buyer1',
      type: 'buyer',
      name: 'Fresh Foods Co.',
      location: [28.7041, 77.1025], // Gurgaon
      details: { demands: ['Premium Wheat', 'Quality Rice'], volume: '2000kg', rating: 4.9 }
    },
    {
      id: 'buyer2',
      type: 'buyer',
      name: 'AgriMart Ltd.',
      location: [19.0760, 72.8777], // Mumbai
      details: { demands: ['Cotton', 'Organic Vegetables'], volume: '1500kg', rating: 4.7 }
    },
    {
      id: 'logistics1',
      type: 'logistics',
      name: 'Regional Transport',
      location: [28.5000, 77.0000], // NCR Region
      details: { services: ['Standard Transport', 'Express Delivery'], rating: 4.7 }
    },
    {
      id: 'logistics2',
      type: 'logistics',
      name: 'AgriLogistics Pro',
      location: [22.5726, 88.3639], // Kolkata
      details: { services: ['Cold Storage', 'Premium Transport'], rating: 4.8 }
    }
  ];

  // Create custom icons for different node types
  const createCustomIcon = (type: 'farmer' | 'buyer' | 'logistics') => {
    const colors = {
      farmer: '#22c55e',
      buyer: '#3b82f6', 
      logistics: '#8b5cf6'
    };

    const emojis = {
      farmer: '🌾',
      buyer: '🏢',
      logistics: '🚚'
    };

    return L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${colors[type]};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          border: 3px solid white;
        ">
          ${emojis[type]}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on India
    map.current = L.map(mapContainer.current).setView([23.5937, 78.9629], 5);

    // Add OpenStreetMap tiles (completely free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Add markers for each network node
    const markers: L.Marker[] = [];
    networkNodes.forEach(node => {
      const marker = L.marker(node.location, {
        icon: createCustomIcon(node.type)
      });

      marker.on('click', () => {
        setSelectedNode(node);
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${node.name}</h3>
          <p class="text-sm text-gray-600">${node.type.charAt(0).toUpperCase() + node.type.slice(1)}</p>
          ${node.details.rating ? `<p class="text-sm">⭐ ${node.details.rating}/5.0</p>` : ''}
        </div>
      `);

      marker.addTo(map.current!);
      markers.push(marker);
    });

    // Add smart connection lines between nodes
    const connections = [
      { from: networkNodes[0], to: networkNodes[3], type: 'supply' }, // farmer1 to buyer1
      { from: networkNodes[1], to: networkNodes[3], type: 'supply' }, // farmer2 to buyer1
      { from: networkNodes[2], to: networkNodes[4], type: 'supply' }, // farmer3 to buyer2
      { from: networkNodes[3], to: networkNodes[5], type: 'logistics' }, // buyer1 to logistics1
      { from: networkNodes[4], to: networkNodes[6], type: 'logistics' }, // buyer2 to logistics2
    ];

    connections.forEach(connection => {
      const line = L.polyline([connection.from.location, connection.to.location], {
        color: connection.type === 'supply' ? '#22c55e' : '#8b5cf6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      });

      line.bindPopup(`
        <div class="p-2">
          <p class="font-medium">Smart Connection</p>
          <p class="text-sm">${connection.from.name} → ${connection.to.name}</p>
          <p class="text-xs text-gray-600">AI-matched ${connection.type}</p>
        </div>
      `);

      line.addTo(map.current!);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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
                AI-powered connections between farmers, buyers, and logistics partners using OpenStreetMap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapContainer} className="w-full h-96 rounded-lg border" />
              <div className="mt-4 text-xs text-muted-foreground">
                🗺️ Powered by OpenStreetMap - Free and open-source mapping
              </div>
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
                      <p className="text-sm text-muted-foreground">⭐ {selectedNode.details.rating}/5.0</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Network Overview</CardTitle>
                <CardDescription>Click on any marker to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🌾</div>
                    <span className="text-sm">Farmers ({networkNodes.filter(n => n.type === 'farmer').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🏢</div>
                    <span className="text-sm">Buyers ({networkNodes.filter(n => n.type === 'buyer').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🚚</div>
                    <span className="text-sm">Logistics ({networkNodes.filter(n => n.type === 'logistics').length})</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    🔗 Green lines show supply connections<br/>
                    🔗 Purple lines show logistics connections<br/>
                    🤖 All connections are AI-optimized
                  </p>
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