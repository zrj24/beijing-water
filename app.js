// app.js
// Handles sidebar and layer toggling for the map

function renderImageGallery(properties, galleryId = 'sluice-img-gallery', mainImgId = 'sluice-img-main') {
  let images = [];
  if (Array.isArray(properties.img)) {
    images = properties.img;
  } else if (typeof properties.img === 'string') {
    try {
      images = JSON.parse(properties.img);
      if (!Array.isArray(images)) images = [];
    } catch (e) {
      images = [];
    }
  }
  if (images.length > 0 && images[0].url) {
    return `<div id='${galleryId}' style='margin-bottom:10px;text-align:center;'>
      <img id='${mainImgId}' src='${images[0].url}' alt='Sluice Image' style='max-width:100%;max-height:180px;object-fit:contain;cursor:pointer;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.12);'>
      ${images.length > 1 ? `<div style='font-size:12px;color:#888;margin-top:2px;'>1 / ${images.length}</div>` : ''}
    </div>`;
  }
  return '';
}

function showSidebar(properties) {
  const sidebar = document.getElementById('sidebar');
  // Determine feature type
  let type = '';
  if (properties && properties.hasOwnProperty('shown_name')) {
    // Check if it's sluices (has upstream/downstream) or points (doesn't have those)
    if (properties.hasOwnProperty('upstream') || properties.hasOwnProperty('downstream') || properties.hasOwnProperty('mileage')) {
      type = 'sluices';
    } else {
      type = 'points';
    }
  } else if (properties && properties.hasOwnProperty('name')) {
    type = 'ancient_sluices';
  }

  let html = '';
  if (type === 'sluices') {
    // Modern sluices: images, title, mileage subtitle, vertical routing table, text
    html += renderImageGallery(properties);
    const title = properties.name || 'Sluice';
    html += `<h2>${title}</h2>`;
    // Show mileage if present and valid
    if (properties.mileage != null && !isNaN(properties.mileage)) {
      const mileageNum = Number(properties.mileage);
      const km = Math.floor(mileageNum);
      const m = Math.round((mileageNum - km) * 1000);
      const mileageRiver = properties.River || '';
      const mileageStr = `${km}+${m.toString().padStart(3, '0')}`;
      html += `<div style='font-size:14px;color:#888;margin-bottom:6px;'>${mileageRiver} ${mileageStr}</div>`;
    }
    html += `<hr><table style="width:100%;margin-bottom:10px;border-collapse:collapse;font-size:15px;">
      <tbody>
        <tr>
          <th style='text-align:left;padding:4px 8px;width:90px;border-bottom:1px solid #ccc;'>上游</th>
          <td style='padding:4px 8px;border-bottom:1px solid #eee;'>${properties.upstream ? properties.upstream : ''}</td>
        </tr>
        <tr>
          <th style='text-align:left;padding:4px 8px;width:90px;border-bottom:1px solid #ccc;'>当前</th>
          <td style='padding:4px 8px;font-weight:bold;border-bottom:1px solid #eee;'>${properties.shown_name || ''}</td>
        </tr>
        <tr>
          <th style='text-align:left;padding:4px 8px;width:90px;'>下游</th>
          <td style='padding:4px 8px;'>${properties.downstream ? properties.downstream : ''}</td>
        </tr>
        ${(typeof properties.warn !== 'undefined' && properties.warn !== null && properties.warn !== '') ? `
        <tr>
          <th style='text-align:left;padding:4px 8px;width:90px;'>警戒水位</th>
          <td style='padding:4px 8px;'>${Number(properties.warn).toFixed(2)}</td>
        </tr>` : ''}
        ${(typeof properties.flood !== 'undefined' && properties.flood !== null && properties.flood !== '') ? `
        <tr>
          <th style='text-align:left;padding:4px 8px;width:90px;'>保证水位</th>
          <td style='padding:4px 8px;'>${Number(properties.flood).toFixed(2)}</td>
        </tr>` : ''}
      </tbody>
    </table>`;
    if (properties.text) {
      html += `<div style=\"margin-top:8px;white-space:pre-line;\">${properties.text}</div>`;
    }
  } else if (type === 'ancient_sluices') {
    // Ancient sluices: title, text, and images if present
    html += renderImageGallery(properties, 'ancient-sluice-img-gallery', 'ancient-sluice-img-main');
    const title = properties.name || 'Historical Sluice';
    html += `<h2>${title}</h2>`;
    if (properties.text) {
      html += `<div style="margin-top:8px;white-space:pre-line;">${properties.text}</div>`;
    }
  } else if (type === 'points') {
    // Points: images, title, text (same as sluices but without routing table)
    html += renderImageGallery(properties, 'point-img-gallery', 'point-img-main');
    const title = properties.name || 'Point';
    html += `<h2>${title}</h2>`;
    if (properties.text) {
      html += `<div style="margin-top:8px;white-space:pre-line;">${properties.text}</div>`;
    }
  } else {
    // Fallback: show all fields (for other layers)
    html += '<h2>Feature Details</h2>';
    html += '<pre>' + JSON.stringify(properties, null, 2) + '</pre>';
  }
  sidebar.innerHTML = html;
  sidebar.classList.add('active');

  // Add modal for image gallery (only once in DOM)
  if (!document.getElementById('sluice-img-modal')) {
    const modal = document.createElement('div');
    modal.id = 'sluice-img-modal';
    modal.style = 'display:none;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);align-items:center;justify-content:center;flex-direction:column;';
    modal.innerHTML = `
      <span id='sluice-img-modal-close' style='position:absolute;top:24px;right:36px;font-size:36px;color:#fff;cursor:pointer;z-index:10001;'>&times;</span>
      <img id='sluice-img-modal-img' src='' style='max-width:90vw;max-height:80vh;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,0.25);margin-bottom:12px;'>
      <div id='sluice-img-modal-caption' style='color:#fff;font-size:17px;text-align:center;max-width:90vw;'></div>
      <div style='margin-top:8px;'>
        <button id='sluice-img-modal-prev' style='font-size:22px;padding:6px 18px;margin-right:18px;border:none;border-radius:4px;background:#fff;cursor:pointer;opacity:0.85;'>⟨</button>
        <button id='sluice-img-modal-next' style='font-size:22px;padding:6px 18px;border:none;border-radius:4px;background:#fff;cursor:pointer;opacity:0.85;'>⟩</button>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
    document.body.appendChild(modal);
  }

  // Setup image click and modal logic after sidebar is rendered
  setTimeout(() => {
    // Try all possible gallery/mainImg IDs
    const gallery = document.getElementById('sluice-img-gallery') || 
                   document.getElementById('ancient-sluice-img-gallery') ||
                   document.getElementById('point-img-gallery');
    if (!gallery) return;
    let images = [];
    if (Array.isArray(properties.img)) {
      images = properties.img;
    } else if (typeof properties.img === 'string') {
      try {
        images = JSON.parse(properties.img);
        if (!Array.isArray(images)) images = [];
      } catch (e) {
        images = [];
      }
    }
    let currentIdx = 0;
    const modal = document.getElementById('sluice-img-modal');
    let modalImg = document.getElementById('sluice-img-modal-img');
    const modalCaption = document.getElementById('sluice-img-modal-caption');
    const modalClose = document.getElementById('sluice-img-modal-close');
    const modalPrev = document.getElementById('sluice-img-modal-prev');
    const modalNext = document.getElementById('sluice-img-modal-next');
    const mainImg = document.getElementById('sluice-img-main') || 
                   document.getElementById('ancient-sluice-img-main') ||
                   document.getElementById('point-img-main');
    if (!mainImg) return;
    function showModal(idx) {
      if (!images[idx]) return;
      // Clear image and caption before loading new
      modalImg.src = '';
      modalCaption.textContent = '';
      // Use setTimeout to ensure the browser clears the image before loading new one
      setTimeout(() => {
        modalImg.src = images[idx].url;
        modalCaption.textContent = images[idx].caption || '';
      }, 0);
      modal.style.display = 'flex';
      currentIdx = idx;
    }
    mainImg.onclick = () => showModal(0);
    modalClose.onclick = () => { modal.style.display = 'none'; };
    modalPrev.onclick = (e) => {
      e.stopPropagation();
      if (currentIdx > 0) showModal(currentIdx - 1);
    };
    modalNext.onclick = (e) => {
      e.stopPropagation();
      if (currentIdx < images.length - 1) showModal(currentIdx + 1);
    };
    // Keyboard navigation
    modal.onkeydown = (e) => {
      if (modal.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft' && currentIdx > 0) showModal(currentIdx - 1);
      if (e.key === 'ArrowRight' && currentIdx < images.length - 1) showModal(currentIdx + 1);
      if (e.key === 'Escape') modal.style.display = 'none';
    };
    // Focus modal for keyboard
    modal.tabIndex = -1;
    modal.addEventListener('transitionend', () => { if (modal.style.display === 'flex') modal.focus(); });
    // Update modal on show
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }, 0);
}

function hideSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('active');
}

function createLayerToggle(layers) {
  
  // Remove existing layer toggle if it exists
  const existingToggle = document.getElementById('layer-toggle');
  if (existingToggle) {
    existingToggle.remove();
  }
  
  // Collapsible state
  let isCollapsed = false;
  
  const container = document.createElement('div');
  container.id = 'layer-toggle';
  container.classList.add('expanded');

  // Add a title for the layer toggle (clickable to collapse/expand)
  const title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '12px';
  title.style.fontSize = '16px';
  title.style.color = '#2c3e50';
  title.style.borderBottom = '2px solid #3498db';
  title.style.paddingBottom = '6px';
  title.style.cursor = 'pointer';
  title.textContent = '图层 >';
  container.appendChild(title);

  title.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      container.classList.remove('expanded');
      container.classList.add('collapsed');
    } else {
      container.classList.remove('collapsed');
      container.classList.add('expanded');
    }
  });

  // When collapsed, clicking the container expands it
  container.addEventListener('click', function (e) {
    if (isCollapsed && e.target === container) {
      isCollapsed = false;
      container.classList.remove('collapsed');
      container.classList.add('expanded');
    }
  });
  
  // Define display order for groups and layers within groups
  const groupOrder = ['Infrastructure', 'Water Bodies', 'Points'];
  const layerDisplayOrder = {
    'Infrastructure': ['ancient_sluices', 'sluices'],
    'Water Bodies': ['lakes_1961', 'lakes', 'rivers_1961', 'rivers'],
    'Points': ['points']
  };
  
  // Group layers by category
  const groups = {};
  layers.forEach(layer => {
    const group = layer.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(layer);
  });
  
  // Create grouped toggles in specified order
  groupOrder.forEach(groupName => {
    if (!groups[groupName]) return;
    
    // Group header
    const groupHeader = document.createElement('div');
    groupHeader.style.fontWeight = '600';
    groupHeader.style.fontSize = '13px';
    groupHeader.style.color = '#34495e';
    groupHeader.style.marginTop = '12px';
    groupHeader.style.marginBottom = '6px';
    groupHeader.style.textTransform = 'uppercase';
    groupHeader.style.letterSpacing = '0.5px';
    groupHeader.textContent = groupName;
    container.appendChild(groupHeader);
    
    // Sort layers within group according to layerDisplayOrder
    const orderedLayers = [];
    if (layerDisplayOrder[groupName]) {
      layerDisplayOrder[groupName].forEach(layerId => {
        const layer = groups[groupName].find(l => l.id === layerId);
        if (layer) orderedLayers.push(layer);
      });
    }
    // Add any remaining layers not in the predefined order
    groups[groupName].forEach(layer => {
      if (!orderedLayers.includes(layer)) {
        orderedLayers.push(layer);
      }
    });
    
    // Layer toggles for this group in correct order
    orderedLayers.forEach(layer => {
      const layerDiv = document.createElement('div');
      layerDiv.style.display = 'flex';
      layerDiv.style.alignItems = 'center';
      layerDiv.style.marginBottom = '6px';
      layerDiv.style.padding = '4px 8px';
      layerDiv.style.borderRadius = '4px';
      layerDiv.style.transition = 'background-color 0.2s';
      
      // Hover effect
      layerDiv.addEventListener('mouseenter', () => {
        layerDiv.style.backgroundColor = '#f8f9fa';
      });
      layerDiv.addEventListener('mouseleave', () => {
        layerDiv.style.backgroundColor = 'transparent';
      });
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.dataset.layer = layer.id;
      checkbox.style.marginRight = '8px';
      checkbox.style.accentColor = '#3498db';
      
      checkbox.addEventListener('change', (e) => {
        const visible = e.target.checked ? 'visible' : 'none';
        layer.map.setLayoutProperty(layer.id, 'visibility', visible);
        
        // Also toggle label layer if it exists
        const labelLayerId = layer.id + '-labels';
        const labelLayer = layer.map.getLayer(labelLayerId);
        if (labelLayer) {
          layer.map.setLayoutProperty(labelLayerId, 'visibility', visible);
        }
      });
      
      const label = document.createElement('label');
      label.style.fontSize = '13px';
      label.style.color = '#2c3e50';
      label.style.cursor = 'pointer';
      label.style.userSelect = 'none';
      label.textContent = layer.name;
      
      // Click label to toggle checkbox
      label.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      });
      
      layerDiv.appendChild(checkbox);
      layerDiv.appendChild(label);
      container.appendChild(layerDiv);
    });
  });
  
  document.body.appendChild(container);
}

window.showSidebar = showSidebar;
window.hideSidebar = hideSidebar;
window.createLayerToggle = createLayerToggle;
