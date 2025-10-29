function adjustGalleryStrips() {
  const galleryItems = document.querySelectorAll(
    "#clone-gallery .gallery-strips-item"
  );
  if (!galleryItems.length) return;

  const galleryContainer = document.getElementById("clone-gallery");
  const containerWidth = galleryContainer.clientWidth;
  const gap = 12;
  const sideGap = gap;
  const imagesPerRow = window.innerWidth <= 768 ? 2 : 6;
  const rowHeight = 250;

  let yOffset = 0;

  for (let i = 0; i < galleryItems.length; i += imagesPerRow) {
    const rowItems = Array.from(galleryItems).slice(i, i + imagesPerRow);
    const ratios = rowItems.map((item) => {
      const img = item.querySelector("img");
      const dims = img.dataset.imageDimensions
        ? img.dataset.imageDimensions.split("x")
        : [img.naturalWidth, img.naturalHeight];
      return parseInt(dims[0], 10) / parseInt(dims[1], 10);
    });

    const totalRatio = ratios.reduce((a, b) => a + b, 0);
    const targetRowWidth =
      containerWidth - gap * (rowItems.length - 1) - 2 * sideGap;
    const isLastRow =
      i + imagesPerRow >= galleryItems.length && rowItems.length < imagesPerRow;
    const rowHeightScaled = isLastRow ? rowHeight : targetRowWidth / totalRatio;

    let xOffset = sideGap;
    rowItems.forEach((item, idx) => {
      const w = rowHeightScaled * ratios[idx];
      const h = rowHeightScaled;
      item.style.width = w + "px";
      item.style.height = h + "px";
      item.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

      const img = item.querySelector("img");
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.opacity = "0"; // Start hidden

      xOffset += w + gap;
    });

    yOffset += rowHeightScaled + gap;
  }

  galleryContainer.style.height = yOffset + "px";
}

function showRowsSequentially() {
  const images = document.querySelectorAll(
    "#clone-gallery .gallery-strips-item img"
  );
  const imagesPerRow = window.innerWidth <= 768 ? 2 : 6;
  const totalRows = Math.ceil(images.length / imagesPerRow);

  let row = 0;
  function showNextRow() {
    if (row >= totalRows) return;

    const start = row * imagesPerRow;
    const end = start + imagesPerRow;
    const rowImages = Array.from(images).slice(start, end);

    rowImages.forEach((img) => {
      img.style.transition = "opacity 1s ease";
      img.style.opacity = "1";
    });

    row++;
    setTimeout(showNextRow, 1000); // delay between row reveals (ms)
  }

  showNextRow();
}

window.addEventListener("load", () => {
  adjustGalleryStrips();

  // Wait until images are laid out before starting fade-in
  setTimeout(() => {
    showRowsSequentially();
  }, 500);
});

window.addEventListener("resize", () => {
  adjustGalleryStrips();

  // Wait until images are laid out before starting fade-in
  setTimeout(() => {
    showRowsSequentially();
  }, 500);
});
