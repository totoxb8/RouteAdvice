import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Clock, TrendingDown, ArrowRight, Zap, Heart, Map, AlertCircle, Trash2, Wifi, WifiOff, Code } from 'lucide-react';

// ==================== COMPOSANT CARTE OPENSTREETMAP ====================

const MapComponent = ({ startLocation, endLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Ajouter Leaflet dynamiquement
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initMap;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    function initMap() {
      if (map.current) return;

      // Créer la carte centrée sur la France
      map.current = window.L.map(mapContainer.current).setView([46.2276, 2.2137], 6);

      // Ajouter OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current);

      // Ajouter marqueurs si les villes sont remplies
      if (startLocation) {
        const startCoords = getCityCoords(startLocation);
        if (startCoords) {
          window.L.marker([startCoords.lat, startCoords.lng], {
            icon: window.L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo(map.current).bindPopup(`📍 ${startLocation}`);
        }
      }

      if (endLocation) {
        const endCoords = getCityCoords(endLocation);
        if (endCoords) {
          window.L.marker([endCoords.lat, endCoords.lng], {
            icon: window.L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo(map.current).bindPopup(`📍 ${endLocation}`);
        }
      }

      // Adapter la vue si les deux villes sont présentes
      if (startLocation && endLocation) {
        const startCoords = getCityCoords(startLocation);
        const endCoords = getCityCoords(endLocation);
        if (startCoords && endCoords) {
          const bounds = window.L.latLngBounds(
            [startCoords.lat, startCoords.lng],
            [endCoords.lat, endCoords.lng]
          );
          map.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [startLocation, endLocation]);

  return (
    <div 
      ref={mapContainer}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '12px',
        border: '1px solid rgba(100, 116, 139, 0.5)'
      }}
    />
  );
};

// Coordonnées des villes françaises
function getCityCoords(city) {
  const cities = {
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Bordeaux': { lat: 44.8378, lng: -0.5792 },
    'Toulouse': { lat: 43.6047, lng: 1.4442 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
    'Nantes': { lat: 47.2184, lng: -1.5536 },
    'Strasbourg': { lat: 48.5734, lng: 7.7521 },
    'Montpellier': { lat: 43.6108, lng: 3.8767 },
    'Lille': { lat: 50.6292, lng: 3.0573 }
  };
  
  const key = Object.keys(cities).find(k => city.toLowerCase().includes(k.toLowerCase()));
  return key ? cities[key] : null;
}

// ==================== COMPOSANT PRINCIPAL ====================
// 🎭 Ce service simule les vraies APIs (Google Maps, TomTom, OpenWeather)
// 📡 Prêt à être remplacé par des appels réels en changeant les URLs et auth

const APIService = {
  logs: [],

  log: (message, data = null) => {
    const logEntry = { timestamp: new Date().toLocaleTimeString(), message, data };
    APIService.logs.push(logEntry);
    console.log(`📡 ${message}`, data || '');
    return logEntry;
  },

  // 🗺️ Simule Google Directions API
  getDirections: async (startLocation, endLocation) => {
    APIService.log('📍 Google Directions API', `${startLocation} → ${endLocation}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const routes = [
      {
        id: 1,
        name: 'Route Rapide (Autoroute)',
        distance: 285,
        duration: 155,
        tollCost: 35.50,
        tollPercentage: 40,
        timeGained: 45,
        description: 'Autoroute A6 + A7',
        segments: [
          { type: 'toll', name: 'A6', distance: 150, cost: 18.50, traffic: 'moderate' },
          { type: 'free', name: 'RN7', distance: 85, cost: 0, traffic: 'light' },
          { type: 'toll', name: 'A7', distance: 50, cost: 17, traffic: 'heavy' }
        ]
      },
      {
        id: 2,
        name: 'Route Mixte Équilibrée',
        distance: 310,
        duration: 195,
        tollCost: 15.80,
        tollPercentage: 25,
        timeGained: 5,
        description: 'Mix autoroute/nationales',
        segments: [
          { type: 'toll', name: 'A6 partielle', distance: 80, cost: 8.80, traffic: 'light' },
          { type: 'free', name: 'RN7 + RN102', distance: 230, cost: 0, traffic: 'moderate' }
        ]
      },
      {
        id: 3,
        name: 'Route Économique',
        distance: 330,
        duration: 240,
        tollCost: 2.50,
        tollPercentage: 5,
        timeGained: 0,
        description: 'Nationales et routes régionales',
        segments: [
          { type: 'free', name: 'RN7 principale', distance: 320, cost: 0, traffic: 'light' },
          { type: 'toll', name: 'Pont péage', distance: 10, cost: 2.50, traffic: 'light' }
        ]
      }
    ];
    
    APIService.log('✅ Directions reçues', `${routes.length} itinéraires`);
    return { status: 'OK', routes, apiUsed: 'Google Directions API' };
  },

  // 🚦 Simule TomTom Traffic API
  getTrafficData: async (routeId) => {
    APIService.log('🚗 TomTom Traffic API', `Route ${routeId}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const trafficData = {
      '8h': { congestion: 85, delays: 45, speed: 45, status: 'congestionné' },
      '12h': { congestion: 45, delays: 15, speed: 110, status: 'normal' },
      '17h': { congestion: 90, delays: 50, speed: 40, status: 'très congestionné' },
      '20h': { congestion: 30, delays: 5, speed: 120, status: 'fluide' },
      '23h': { congestion: 10, delays: 0, speed: 130, status: 'fluide' }
    };
    
    APIService.log('✅ Données trafic reçues', '5 créneaux horaires');
    return { status: 'OK', trafficData, timestamp: new Date().toISOString() };
  },

  // 📍 Simule Geocoding API
  geocode: async (address) => {
    APIService.log('🌍 Geocoding API', address);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockCoordinates = {
      'Paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
      'Marseille': { lat: 43.2965, lng: 5.3698, name: 'Marseille, France' },
      'Lyon': { lat: 45.7640, lng: 4.8357, name: 'Lyon, France' },
      'Bordeaux': { lat: 44.8378, lng: -0.5792, name: 'Bordeaux, France' },
      'Toulouse': { lat: 43.6047, lng: 1.4442, name: 'Toulouse, France' }
    };
    
    const key = Object.keys(mockCoordinates).find(k => address.toLowerCase().includes(k.toLowerCase()));
    const coords = key ? mockCoordinates[key] : { lat: 48.8566, lng: 2.3522, name: address };
    
    APIService.log('✅ Coordonnées trouvées', `${coords.lat}, ${coords.lng}`);
    return { status: 'OK', location: coords };
  },

  // 💳 Simule API données péage
  getTollData: async (routeSegments) => {
    APIService.log('💰 Toll Data API', `${routeSegments.length} segments`);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    APIService.log('✅ Données péage reçues', 'Vinci/Sanef');
    return { 
      status: 'OK',
      provider: 'Vinci / Sanef',
      currency: 'EUR'
    };
  }
};

// ==================== COMPONENT ====================

const RoutePlanner = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [maxTollBudget, setMaxTollBudget] = useState(50);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [trafficData, setTrafficData] = useState({});
  const [apiLogs, setApiLogs] = useState([]);
  const [showApiLogs, setShowApiLogs] = useState(false);

  // Charger favoris au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('routeFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement favoris');
      }
    }
  }, []);

  // Sauvegarder favoris
  const saveFavorite = (route) => {
    const journey = { startLocation, endLocation, route, timestamp: new Date() };
    const updatedFavorites = [...favorites, journey];
    setFavorites(updatedFavorites);
    localStorage.setItem('routeFavorites', JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem('routeFavorites', JSON.stringify(updated));
  };

  const loadFavorite = (favorite) => {
    setStartLocation(favorite.startLocation);
    setEndLocation(favorite.endLocation);
    setShowFavorites(false);
    setSelectedRoute(favorite.route);
  };

  const getTrafficColor = (level) => {
    if (level === 'light') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (level === 'moderate') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const getTrafficLabel = (level) => {
    if (level === 'light') return '✓ Fluide';
    if (level === 'moderate') return '⚠ Modéré';
    return '⛔ Congestionné';
  };

  const getRatioBenefit = (route) => {
    if (route.tollCost === 0) return '∞';
    return (route.timeGained / route.tollCost).toFixed(2);
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
  };

  // 🔥 FONCTION PRINCIPALE - Calcul avec APIs
  const calculateRoutes = async () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      alert('Veuillez remplir les deux champs de localisation');
      return;
    }

    setIsCalculating(true);
    setApiLogs([]);
    APIService.logs = [];
    
    try {
      // 1️⃣ Geocoding - Convertir adresses en coordonnées
      const startCoords = await APIService.geocode(startLocation);
      const endCoords = await APIService.geocode(endLocation);

      // 2️⃣ Directions - Obtenir les itinéraires
      const directionsResult = await APIService.getDirections(startLocation, endLocation);

      // 3️⃣ Traffic Data - Obtenir données de circulation
      const trafficResult = await APIService.getTrafficData(1);
      setTrafficData(trafficResult.trafficData);

      // 4️⃣ Toll Data - Obtenir données de péage
      const tollResult = await APIService.getTollData(directionsResult.routes[0].segments);

      // Filtrer par budget et trier
      const filtered = directionsResult.routes.filter(r => r.tollCost <= maxTollBudget);
      const sorted = filtered.sort((a, b) => b.timeGained - a.timeGained);
      
      setRoutes(sorted.slice(0, 2));
      setSelectedRoute(null);
      
      // Afficher logs
      setApiLogs([...APIService.logs]);
      APIService.log('✨ Calcul terminé avec succès', `${sorted.length} itinéraires trouvés`);

    } catch (error) {
      APIService.log('❌ Erreur API', error.message);
      setApiLogs([...APIService.logs]);
    }
    
    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    }}>
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}>
                <MapPin size={24} className="text-white" />
              </div>
              <h1 style={{ 
                fontSize: '28px',
                fontWeight: '700',
                color: '#f8fafc',
                fontFamily: "'Poppins', sans-serif"
              }}>RouteAdvice</h1>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">AVEC APIs</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowApiLogs(!showApiLogs)}
                className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2 transition text-sm font-semibold"
              >
                <Code size={16} />
                Logs
              </button>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2 transition text-sm font-semibold"
              >
                <Heart size={18} />
                Favoris ({favorites.length})
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Trouvez la meilleure route selon votre budget de péage</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* API Logs Modal */}
        {showApiLogs && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto border border-slate-700">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">📡 Logs API (MOCK)</h2>
                <button onClick={() => setShowApiLogs(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-4 space-y-2 font-mono text-xs">
                {apiLogs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center">Lancez un calcul pour voir les logs API</div>
                ) : (
                  apiLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-700/30 rounded p-2 border border-slate-600/50">
                      <div className="text-blue-400">[{log.timestamp}]</div>
                      <div className="text-slate-300">{log.message}</div>
                      {log.data && <div className="text-slate-500 mt-1">{JSON.stringify(log.data).substring(0, 80)}...</div>}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-amber-500/10 border-t border-slate-700 p-4 border-amber-500/30">
                <p className="text-amber-300 text-xs font-semibold mb-2">💡 Comment connecter les vraies APIs :</p>
                <p className="text-amber-200/80 text-xs">Remplacez les URLs de fetch et les clés API dans le fichier source. Les mocks retournent déjà la bonne structure de données !</p>
              </div>
            </div>
          </div>
        )}

        {/* Favoris Modal */}
        {showFavorites && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto border border-slate-700">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">Trajets favoris</h2>
                <button onClick={() => setShowFavorites(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              {favorites.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Heart size={32} className="mx-auto mb-3 opacity-50" />
                  <p>Aucun trajet favori sauvegardé</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {favorites.map((fav, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between border border-slate-600/50">
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{fav.startLocation} → {fav.endLocation}</div>
                        <div className="text-slate-400 text-xs mt-1">{fav.route.name} • {fav.route.tollCost}€</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadFavorite(fav)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-semibold"
                        >
                          Charger
                        </button>
                        <button
                          onClick={() => removeFavorite(idx)}
                          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Point de départ
              </label>
              <input
                type="text"
                placeholder="Ex: Paris, Marseille, Lyon..."
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="Ex: Paris, Marseille, Lyon..."
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-300 text-sm font-semibold">
                Budget péage maximal : <span className="text-emerald-400 font-bold">{maxTollBudget}€</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={maxTollBudget}
              onChange={(e) => setMaxTollBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>0€</span>
              <span>150€</span>
            </div>
          </div>

          <button
            onClick={calculateRoutes}
            disabled={isCalculating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Calcul avec APIs en cours...
              </>
            ) : (
              <>
                <Zap size={20} />
                Calculer les meilleures routes
              </>
            )}
          </button>
        </div>

        {/* Routes Results */}
        {routes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f8fafc',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {routes.length} itinéraire{routes.length > 1 ? 's' : ''} correspondant à votre budget
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'search' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}
                >
                  Routes
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}
                >
                  <Map size={16} /> Carte
                </button>
                <button
                  onClick={() => setActiveTab('traffic')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'traffic' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}
                >
                  Circulation
                </button>
              </div>
            </div>

            {/* Tab: Routes */}
            {activeTab === 'search' && (
              <div className="grid md:grid-cols-2 gap-6">
                {routes.map((route, index) => (
                  <div
                    key={route.id}
                    onClick={() => handleSelectRoute(route)}
                    className={`bg-slate-800/50 backdrop-blur-md border rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedRoute?.id === route.id
                        ? 'border-blue-500/80 ring-2 ring-blue-500/20 bg-slate-800/80'
                        : 'border-slate-700/50 hover:border-slate-600/80'
                    }`}
                  >
                    {index === 0 && (
                      <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        ⭐ RECOMMANDÉ
                      </div>
                    )}

                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#f8fafc',
                      fontFamily: "'Poppins', sans-serif",
                      marginBottom: '8px'
                    }}>
                      {route.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{route.description}</p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <MapPin size={14} />
                          Distance
                        </div>
                        <div className="text-white font-bold text-lg">{route.distance} km</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Clock size={14} />
                          Durée
                        </div>
                        <div className="text-white font-bold text-lg">{route.duration} min</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <DollarSign size={14} />
                          Péage
                        </div>
                        <div className="text-emerald-400 font-bold text-lg">{route.tollCost}€</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <TrendingDown size={14} />
                          Ratio
                        </div>
                        <div className="text-blue-400 font-bold text-lg">{getRatioBenefit(route)} min/€</div>
                      </div>
                    </div>

                    {/* Toll Percentage */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs">Pourcentage péage sur trajet</span>
                        <span className="text-white font-semibold text-sm">{route.tollPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${route.tollPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Segments */}
                    <div className="space-y-2 mb-4">
                      {route.segments.map((segment, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`px-2 py-1 rounded text-xs font-semibold border ${
                            segment.type === 'toll'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {segment.type === 'toll' ? 'Péage' : 'Gratuit'}
                          </div>
                          <span className="text-slate-300 flex-1">{segment.name}</span>
                          <div className={`px-2 py-1 rounded text-xs font-semibold border ${getTrafficColor(segment.traffic)}`}>
                            {getTrafficLabel(segment.traffic)}
                          </div>
                          <span className="text-slate-400 text-xs min-w-12">{segment.distance} km</span>
                          {segment.cost > 0 && <span className="text-emerald-400 font-semibold">{segment.cost}€</span>}
                        </div>
                      ))}
                    </div>

                    {/* Buttons */}
                    <button
                      onClick={() => saveFavorite(route)}
                      className="w-full mb-2 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    >
                      <Heart size={16} />
                      Ajouter aux favoris
                    </button>

                    <button className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                      selectedRoute?.id === route.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}>
                      {selectedRoute?.id === route.id ? '✓ Sélectionné' : 'Choisir'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Carte */}
            {activeTab === 'map' && (
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8">
                <MapComponent startLocation={startLocation} endLocation={endLocation} />
                <div className="mt-4 text-center text-slate-400 text-sm">
                  🗺️ Carte OpenStreetMap avec les marqueurs de départ et arrivée
                </div>
              </div>
            )}

            {/* Tab: Circulation */}
            {activeTab === 'traffic' && (
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-white font-bold text-lg mb-6">Données de circulation horaires</h3>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {routes.map((route) => (
                    <div key={route.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                      <h4 className="text-white font-semibold text-sm mb-4">{route.name}</h4>
                      <div className="space-y-3">
                        {Object.entries(trafficData).map(([hour, data]) => (
                          <div key={hour}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-slate-400 text-xs font-semibold">{hour}</span>
                              <span className="text-white text-xs">{data.congestion}% congestion</span>
                            </div>
                            <div className="w-full bg-slate-600/30 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  data.congestion > 70 ? 'bg-red-500' : 
                                  data.congestion > 40 ? 'bg-yellow-500' : 
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${data.congestion}%` }}
                              />
                            </div>
                            <div className="text-slate-500 text-xs mt-1">+{data.delays} min de délai</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-300 font-semibold text-sm mb-1">Meilleur créneau</h4>
                      <p className="text-blue-200/80 text-sm">Entre 20h-23h avec circulation minimale et peu de délais additionnels.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {routes.length === 0 && !isCalculating && (startLocation || endLocation) && (
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">Aucune route ne correspond à votre budget de péage.</p>
            <p className="text-slate-500 text-sm mt-2">Augmentez le budget maximal pour voir plus d'options.</p>
          </div>
        )}

        {/* Start Screen */}
        {routes.length === 0 && !isCalculating && !startLocation && !endLocation && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-16 text-center">
              <MapPin className="mx-auto mb-4 text-blue-400" size={48} />
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#f8fafc',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '8px'
              }}>
                Planifiez votre trajet
              </h2>
              <p className="text-slate-400">
                Entrez votre point de départ et votre destination, puis définissez votre budget de péage maximum.
              </p>
            </div>

            {/* Documentation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-purple-300 font-bold text-lg mb-3">🔗 APIs Mockées</h3>
                <ul className="text-purple-200/80 text-sm space-y-2">
                  <li>✓ Google Directions API</li>
                  <li>✓ TomTom Traffic API</li>
                  <li>✓ Geocoding API</li>
                  <li>✓ Toll Data API</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-emerald-300 font-bold text-lg mb-3">📚 Prochaines étapes</h3>
                <ul className="text-emerald-200/80 text-sm space-y-2">
                  <li>1. Obtenir clés API (Google/TomTom)</li>
                  <li>2. Remplacer les URLs de mock</li>
                  <li>3. Intégrer Mapbox pour la carte</li>
                  <li>4. Connecter base de données</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;
