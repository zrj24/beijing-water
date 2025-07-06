// Layer style definitions - Professional styling approach
const layerStyles = {
  // Point layers (sluices, settlements)
  'sluices': {
    type: 'symbol',
    layout: {
      'icon-image': 'sluices-icon',
      'icon-size': {
        base: 1,
        stops: [[10, 0.6], [14, 0.8], [18, 1.0]]
      },
      'icon-anchor': 'center',
      'icon-allow-overlap': true,
      'icon-rotate': ['get', 'direction'],
      'text-field': [
        'case',
        ['has', 'shown_name'], ['get', 'shown_name'],
        ''
      ],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-offset': [0, 1],
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [[10, 10], [14, 13], [18, 16]]
      },
      'text-max-width': 8,
      'text-justify': 'center',
      'text-optional': true
    },
    paint: {
      'text-color': '#2c3e50',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2,
      'text-halo-blur': 0.5,
      'text-opacity': {
        base: 1,
        stops: [[10, 0.7], [14, 0.9], [18, 1.0]]
      }
    },
    fallback: {
      type: 'circle',
      paint: {
        'circle-radius': {
          base: 1.2,
          stops: [[10, 4], [14, 6], [18, 8]]
        },
        'circle-color': '#e74c3c',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    }
  },
  
  'ancient_sluices': {
    type: 'symbol',
    layout: {
      'icon-image': 'ancient_sluices-icon',
      'icon-size': {
        base: 1,
        stops: [[10, 0.6], [14, 0.8], [18, 1.0]]
      },
      'icon-allow-overlap': true,
      'icon-rotate': ['get', 'direction'],
      'text-field': [
        'case',
        ['has', 'name'], ['get', 'name'],
        ''
      ],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-offset': [0, 0.75],
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [[10, 10], [14, 13], [18, 16]]
      },
      'text-max-width': 8,
      'text-justify': 'center',
      'text-optional': true
    },
    paint: {
      'text-color': '#8e44ad',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2,
      'text-halo-blur': 0.5,
      'text-opacity': {
        base: 1,
        stops: [[10, 0.7], [14, 0.9], [18, 1.0]]
      }
    },
    fallback: {
      type: 'circle',
      paint: {
        'circle-radius': {
          base: 1.2,
          stops: [[10, 4], [14, 6], [18, 8]]
        },
        'circle-color': '#f39c12',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    }
  },

  // Line layers (rivers)
  'rivers': {
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#00aeef',
      'line-width': {
        base: 1.2,
        stops: [[8, 1], [12, 3], [16, 5]]
      },
      'line-opacity': 0.8
    }
  },

  'rivers_1961': {
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#d5b43c',
      'line-width': {
        base: 1.2,
        stops: [[8, 1], [12, 2.5], [16, 4]]
      },
      'line-opacity': 0.7,
    }
  },

  // Polygon layers (lakes)
  'lakes': {
    type: 'fill',
    paint: {
      'fill-color': '#3498db',
      'fill-opacity': {
        base: 1,
        stops: [[8, 0.3], [12, 0.4], [16, 0.5]]
      },
      'fill-outline-color': '#00aeef'
    }
  },

  'lakes_1961': {
    type: 'fill',
    paint: {
      'fill-color': '#ff9e17',
      'fill-opacity': {
        base: 1,
        stops: [[8, 0.25], [12, 0.35], [16, 0.45]]
      },
      'fill-outline-color': '#d5b43c'
    }
  },

  // Label layers for rivers
  'rivers-labels': {
    type: 'symbol',
    layout: {
      'symbol-placement': 'line',
      'text-field': [
        'case',
        ['has', 'shown_name'], ['get', 'shown_name'],
        ['has', 'name'], ['get', 'name'],
        ''
      ],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': {
        base: 1,
        stops: [[10, 10], [14, 13], [18, 16]]
      },
      'text-max-width': 12,
      'text-justify': 'center',
      'text-optional': true
    },
    paint: {
      'text-color': '#0074d9',
      'text-halo-color': '#fff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
      'text-opacity': 0.85
    }
  },
  'rivers_1961-labels': {
    type: 'symbol',
    layout: {
      'symbol-placement': 'line',
      'text-field': [
        'case',
        ['has', 'name'], ['get', 'name'],
        ['has', 'Name'], ['get', 'Name'],
        ''
      ],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': {
        base: 1,
        stops: [[10, 10], [14, 13], [18, 16]]
      },
      'text-max-width': 12,
      'text-justify': 'center',
      'text-optional': true
    },
    paint: {
      'text-color': '#b8860b',
      'text-halo-color': '#fff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
      'text-opacity': 0.85
    }
  },
  
  'points': {
    type: 'circle',
    paint: {
      'circle-radius': {
        base: 1.2,
        stops: [[10, 4], [14, 6], [18, 8]]
      },
      'circle-color': '#27ae60',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.9
    }
  },

  // Label layer for points
  'points-labels': {
    type: 'symbol',
    layout: {
      'text-field': [
        'case',
        ['has', 'shown_name'], ['get', 'shown_name'],
        ['has', 'name'], ['get', 'name'],
        ''
      ],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-offset': [0, 1.2],
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [[10, 10], [14, 12], [18, 14]]
      },
      'text-max-width': 8,
      'text-justify': 'center',
      'text-optional': true
    },
    paint: {
      'text-color': '#27ae60',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2,
      'text-halo-blur': 0.5,
      'text-opacity': {
        base: 1,
        stops: [[10, 0.7], [14, 0.9], [18, 1.0]]
      }
    }
  }
};

// Layer configuration with display names and groups
const layerConfig = {
  'sluices': {
    name: '现用水闸',
    group: 'Infrastructure',
    visible: true,
    interactive: true
  },
  'ancient_sluices': {
    name: '历史水闸',
    group: 'Infrastructure',
    visible: true,
    interactive: true
  },
  'rivers': {
    name: '河（2025）',
    group: 'Water Bodies',
    visible: true,
    interactive: false
  },
  'rivers_1961': {
    name: '河（1961）',
    group: 'Water Bodies',
    visible: true,
    interactive: false
  },
  'lakes': {
    name: '湖（2025）',
    group: 'Water Bodies',
    visible: true,
    interactive: false
  },
  'lakes_1961': {
    name: '湖（1961）',
    group: 'Water Bodies',
    visible: true,
    interactive: false
  },
  'points': {
    name: '地标点',
    group: 'Points',
    visible: true,
    interactive: true
  }
};

// Export for use in main script
window.layerStyles = layerStyles;
window.layerConfig = layerConfig;
