// Toggle expand/collapse for the clicked node's immediate tree-item
function toggle(node) {
  const item = node.closest('.tree-item');
  item.classList.toggle('expanded');

  // wait a tick for DOM layout update, then redraw
  setTimeout(drawLines, 50);
}

// Draw curved Bezier connections
function drawLines() {
  const svg = document.getElementById('lines');
  const container = document.getElementById('container');

  // size the svg to container's scrollable area (not just visible)
  const width = container.scrollWidth;
  const height = container.scrollHeight;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.width = width + 'px';
  svg.style.height = height + 'px';

  // clear old paths
  svg.innerHTML = '';

  // draw paths
  const allItems = container.querySelectorAll('.tree-item');

  allItems.forEach(parentItem => {
    const childrenWrapper = parentItem.querySelector(':scope > .children');
    const parentNode = parentItem.querySelector(':scope > .node');
    if (!childrenWrapper || !parentNode) return;
    if (getComputedStyle(childrenWrapper).display === 'none') return;

    const childItems = childrenWrapper.querySelectorAll(':scope > .tree-item');
    childItems.forEach(childItem => {
      const childNode = childItem.querySelector(':scope > .node');
      if (!childNode) return;

      const pRect = parentNode.getBoundingClientRect();
      const cRect = childNode.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const startX = (pRect.left + pRect.width / 2) - containerRect.left;
      const startY = (pRect.bottom) - containerRect.top;
      const endX = (cRect.left + cRect.width / 2) - containerRect.left;
      const endY = (cRect.top) - containerRect.top;

      const cpx1 = startX;
      const cpy1 = startY + (endY - startY) * 0.4;
      const cpx2 = endX;
      const cpy2 = startY + (endY - startY) * 0.6;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${startX} ${startY} C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${endX} ${endY}`);
      path.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--line') || '#888');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
    });
  });
}

// Initial draw
window.addEventListener('load', drawLines);
window.addEventListener('resize', () => requestAnimationFrame(drawLines));
