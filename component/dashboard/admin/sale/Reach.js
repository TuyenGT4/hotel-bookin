import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { interpolateRainbow } from "d3-scale-chromatic";

const countryCoordinates = {
  India: [79.0882, 21.1458], // Center of India
  USA: [-98.5855, 39.8333], // Geographic center of contiguous US
  Canada: [-96.8175, 60.1087], // Geographic center of Canada
  Australia: [134.4896, -25.7344], // Center of Australia
  Japan: [138.2529, 36.2048], // Center of main islands
  Germany: [10.0183, 51.1335], // Geographic center
  Brazil: [-54.3889, -14.235], // Center point
  "South Africa": [24.0833, -29.0], // Better center
  France: [2.6188, 46.7111], // Center of metropolitan France
  China: [103.8198, 36.5616], // Center of China proper
  UK: [-2.8656, 54.1239], // Center including Scotland
  Mexico: [-102.5528, 23.6345], // Center of Mexico
  Italy: [12.5674, 42.8719], // Adjusted center
  Spain: [-3.7492, 40.4637], // Center of Spain
  Russia: [94.3188, 61.524], // Adjusted for Russia's size
};

const countryEmojis = {
  India: "🇮🇳",
  USA: "🇺🇸",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Japan: "🇯🇵",
  Germany: "🇩🇪",
  Brazil: "🇧🇷",
  "South Africa": "🇿🇦",
  France: "🇫🇷",
  China: "🇨🇳",
  UK: "🇬🇧",
  Mexico: "🇲🇽",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Russia: "🇷🇺",
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function UltraColorfulBubbleMap() {
  const [data, setData] = useState([]);

  const [activeMarker, setActiveMarker] = useState(null);

  const [viewState, setViewState] = useState({
    zoom: 1,
    center: [0, 0],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/reach`);

        const countryCounts = await response.json();

        const mapData = countryCounts.map((item, i) => {
          const countryName = item._id;

          return {
            name: countryName,
            coordinates: countryCoordinates[countryName] || [0, 0],

            value: item.count * 100,
            emoji: countryEmojis[countryName] || "🎌",

            color: interpolateRainbow(1 / countryCounts.length),

            glowColor: `hsla(${Math.floor(
              Math.random() * 360
            )},100%,70%,0.7   )`,

            pulseColor: `hsla(${Math.floor(
              Math.random() * 360
            )},100%,50%,0.5   )`,
          };
        });

        setData(mapData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoveEnd = (newViewState) => {
    setViewState({
      zoom: newViewState.zoom,
      center: newViewState.coordinates,
    });
    setIsDragging(false);
  };

  const handleMoveStart = () => {
    setIsDragging(true);
  };

  const resetView = () => {
    setViewState({
      zoom: 1,
      center: [0, 0],
    });
  };

  if (loading) {
    return (
      <div className="text-white text-center py-20">Loading map data...</div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-white text-center py-20">
        No country data available
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[700px] bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150,
            center: [20, 20],
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={viewState.zoom}
            center={viewState.center}
            onMoveEnd={handleMoveEnd}
            onMoveStart={handleMoveStart}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <motion.g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={`hsl(${Math.random() * 60 + 200}, 70%, ${
                        Math.random() * 20 + 50
                      }%)`}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`,
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  </motion.g>
                ))
              }
            </Geographies>

            <AnimatePresence>
              {data.map(
                ({
                  name,
                  coordinates,
                  value,
                  color,
                  emoji,
                  glowColor,
                  pulseColor,
                }) => {
                  const size = (Math.sqrt(value) / 3) * viewState.zoom;
                  const isActive = activeMarker === name;

                  return (
                    <Marker key={name} coordinates={coordinates}>
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 100,
                          delay: Math.random() * 0.5,
                        }}
                        whileHover={{ scale: 1.15 }}
                        onMouseEnter={() =>
                          !isDragging && setActiveMarker(name)
                        }
                        onMouseLeave={() =>
                          !isDragging && setActiveMarker(null)
                        }
                      >
                        {/* Pulse effect */}
                        {isActive && (
                          <motion.circle
                            r={size * 6}
                            fill={pulseColor}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                              opacity: [0, 0.5, 0],
                              scale: [0.5, 1.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        )}

                        {/* Glow effect */}
                        <motion.circle
                          r={size * 2}
                          fill={glowColor}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isActive ? 0.6 : 0.3 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Main bubble */}
                        <motion.circle
                          r={size * 2}
                          fill={color}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          style={{
                            filter: isActive
                              ? `drop-shadow(0 0 20px ${color})`
                              : `drop-shadow(0 0 10px ${color})`,
                            cursor: "pointer",
                          }}
                          animate={{
                            fill: isActive ? color : color,
                          }}
                        />

                        {/* Emoji flag */}
                        <motion.text
                          textAnchor="middle"
                          y={4}
                          style={{
                            fontFamily: "sans-serif",
                            fontSize: `${size / 1.5}px`,
                            pointerEvents: "none",
                            userSelect: "none",
                          }}
                          animate={{
                            opacity: isActive ? 1 : 0.8,
                            scale: isActive ? 1.2 : 1,
                          }}
                        >
                          {emoji}
                        </motion.text>

                        {/* Country name */}
                        <motion.text
                          textAnchor="middle"
                          y={-size - 10}
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fill: "#FFFFFF",
                            fontWeight: "bold",
                            fontSize: "14px",
                            pointerEvents: "none",
                            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                          }}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? -size - 10 : -size - 5,
                          }}
                        >
                          {name}
                        </motion.text>

                        {/* Value indicator */}
                        {isActive && (
                          <motion.text
                            textAnchor="middle"
                            y={size + 20}
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fill: "#FFFFFF",
                              fontSize: "12px",
                              pointerEvents: "none",
                              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                            }}
                            initial={{ opacity: 0, y: size + 10 }}
                            animate={{ opacity: 1, y: size + 20 }}
                          >
                            Bookings: {value / 100}{" "}
                            {/* Divide by 100 to get actual count */}
                          </motion.text>
                        )}
                      </motion.g>
                    </Marker>
                  );
                }
              )}
            </AnimatePresence>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </>
  );
}
