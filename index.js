const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let img = new Image();
let fileName = '';

const downloadBtn = document.getElementById('download-btn');
const uploadFile = document.getElementById('upload-file');
const revertBtn = document.getElementById('revert-btn');

// Add Filters & Effects
// Event delegation
document.addEventListener('click', ({ target }) => {
  const { name, value } = target;
  const action = (name, value) => {
    Caman('#canvas', img, function(){
      value ? this[name](value).render() : this[name]().render();
    });
  };
  name ? action(name) : null;
});

// Revert Filters
revertBtn.addEventListener('click', (e) => {
  Caman('#canvas', img, function() {
    this.revert();
  })
})


// Upload File
uploadFile.addEventListener('change', (e) => {
  // Get File
  const file = uploadFile.files[0];

  // Init FileReader
  const reader = new FileReader();

  if(file){
    // Set file name
    fileName = file.name;
    // Read data as URL
    reader.readAsDataURL(file);
  }

  // Add image to canvas
  reader.addEventListener('load', () => {
    // Create img
    img = new Image();
    // Set src
    img.src = reader.result;
    // On image load, add to canvas
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      canvas.removeAttribute('data-caman-id');
    }
  }, false);
});

// Download Event
downloadBtn.addEventListener('click', (e) => {
  // Get file ext
  let fileExtension = '';

  fileName.includes('.jpeg') ? fileExtension = fileName.slice(-5) : fileExtension = fileName.slice(-4); //remove the .ext eg. jpg, png

  // Init new filename
  let newFileName;

  // Check image type
  if(fileExtension === '.jpg' || fileExtension === '.png'){
    newFileName = fileName.substring(0, fileName.length -4) + '-edited.jpg';
  } else if(fileExtension === '.jpeg'){
    newFileName = fileName.substring(0, fileName.length -5) + '-edited.jpg';
  }

  // Call download
  download(canvas, newFileName);
});

// Downlaod function
function download(canvas, filename) {
  // Init event
  let e;
  // Create link
  const link = document.createElement('a');

  // Set props
  link.download = filename; 
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  // New mouse event
  e = new MouseEvent('click');
  // Dispatch event
  link.dispatchEvent(e);
}