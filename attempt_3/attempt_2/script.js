const track = document.getElementById('carouselTrack');
const tenetBoxes = Array.from(track.children);
const totalTenets = tenetBoxes.length;
const maxVisible = 3;

const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let itemsPerView = getItemsPerView();
let currentIndex = itemsPerView; // Start at first real item (after clones)
let itemWidth = 0;

function getItemsPerView() {
  if (window.innerWidth <= 500) return 1;
  if (window.innerWidth <= 950) return 2;
  return 3;
}

function updateItemWidth() {
  const box = track.querySelector('.tenet-box');
  if (!box) return 0;
  const style = getComputedStyle(box);
  return box.offsetWidth +
    parseInt(style.marginLeft) +
    parseInt(style.marginRight);
}

function setupClones() {
  // Remove old clones
  track.querySelectorAll('.clone').forEach(clone => clone.remove());

  // Clone last N and prepend
  for (let i = 0; i < itemsPerView; i++) {
    const clone = tenetBoxes[totalTenets - 1 - i].cloneNode(true);
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  }
  // Clone first N and append
  for (let i = 0; i < itemsPerView; i++) {
    const clone = tenetBoxes[i].cloneNode(true);
    clone.classList.add('clone');
    track.appendChild(clone);
  }
}

function setTrackPosition(animate = true) {
  if (!animate) track.style.transition = 'none';
  else track.style.transition = '';
  track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  if (!animate) {
    // Force reflow to apply transition reset
    void track.offsetWidth;
    track.style.transition = '';
  }
}

function goToIndex(index, animate = true) {
  currentIndex = index;
  setTrackPosition(animate);
}

function next() {
  goToIndex(currentIndex + 1);
}
function prev() {
  goToIndex(currentIndex - 1);
}

function handleTransitionEnd() {
  if (currentIndex >= totalTenets + itemsPerView) {
    // Jump back to real first
    goToIndex(itemsPerView, false);
  } else if (currentIndex < itemsPerView) {
    // Jump to real last
    goToIndex(totalTenets + itemsPerView - 1, false);
  }
}

function onResize() {
  itemsPerView = getItemsPerView();
  setupClones();
  itemWidth = updateItemWidth();
  currentIndex = itemsPerView;
  setTrackPosition(false);
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
track.addEventListener('transitionend', handleTransitionEnd);
window.addEventListener('resize', onResize);

// Initial setup
setupClones();
itemWidth = updateItemWidth();
setTrackPosition(false);

// Recalculate on font load (for accurate width)
window.addEventListener('load', () => {
  itemWidth = updateItemWidth();
  setTrackPosition(false);
});