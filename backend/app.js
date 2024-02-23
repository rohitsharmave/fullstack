const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json'); // Path to your Firebase service account key
const cors = require('cors');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nodejsquestion-7bb3f.appspot.com' // Replace with your Firebase Storage bucket name
});


const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function fibonacci(n) {
  if (n <= 1) {
      return BigInt(n);
  }
  let a = BigInt(0);
  let b = BigInt(1);
  let temp;
  for (let i = 2; i <= n; i++) {
      temp = a + b;
      a = b;
      b = temp;
  }
  return b;
}

// API endpoint to calculate Fibonacci value at a given position
app.get('/fibonacci/:position', (req, res) => {
    const position = parseInt(req.params.position);
    if (isNaN(position) || position < 0) {
      return res.status(400).json({ error: 'Invalid position' });
    }
  
    const result = fibonacci(position).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    res.json({ position, result });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const bucket = admin.storage().bucket();
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file.');
    });

    blobStream.on('finish', () => {
      // const privateUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
      res.status(200).send({'publicUrl':publicUrl});


    });

    blobStream.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file.');
  }
});


// Initialize an object to store calculated ring migration steps
const migrateMemo = {};
 
function migrateRings(N, A, B, C) {
  if (migrateMemo[`${N}-${A}-${B}-${C}`]) {
    return migrateMemo[`${N}-${A}-${B}-${C}`];
  }
 
  const steps = [];
 
  function moveRings(n, source, destination, auxiliary) {
    if (n === 1) {
      steps.push(`${n}: ${source} to ${destination}`);
    } else {
      moveRings(n - 1, source, auxiliary, destination);
      steps.push(`${n}: ${source} to ${destination}`);
      moveRings(n - 1, auxiliary, destination, source);
    }
  }
 
  moveRings(N, A, B, C);
  migrateMemo[`${N}-${A}-${B}-${C}`] = steps;
 
  return steps;
}

app.get('/migrateRings/:N/:A/:B/:C', (req, res) => {
  const { N, A, B, C } = req.params;
  if (!N || isNaN(N) || N < 0 || !A || !B || !C) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
 
  const result = migrateRings(Number(N), A, B, C);
  res.json(result);
});


app.get('/list-images', async (req, res) => {
  const bucket = admin.storage().bucket();
 
  try {
    // Lists all files in the bucket
    const [files] = await bucket.getFiles();
   
    const mediaUrls = [];
 
    files.forEach(file => {
      // Generate public URL for each file
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
     
      // Check file type based on extension (you can use a more sophisticated check if needed)
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let fileType = null;
 
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        fileType = 'image';
      } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
        fileType = 'video';
      }
 
      // Store in the single array with type property
      mediaUrls.push({ url: publicUrl, type: fileType });
    });
 
    res.status(200).json(mediaUrls);
  } catch (error) {
    console.error('Failed to list files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});


app.post('/balanced-substrings', (req, res) => {
  const s = req.body.balancedstring;
  if (!s) {
      return res.status(400).json({ error: 'Missing input string in request body' });
  }

  const result = getBalancedSubstrings(s);
  res.json({ result });
});

function getBalancedSubstrings(S) {
  const result = [];
  let maxLength = 0;

  for (let i = 0; i < S.length; i++) {
      for (let j = i + 1; j <= S.length; j++) {
          const substring = S.substring(i, j);
          if (isBalanced(substring)) {
              const length = j - i;
              if (length > maxLength) {
                  maxLength = length;
                  result.splice(0, result.length, substring);
              } else if (length === maxLength) {
                  result.push(substring);
              }
          }
      }
  }

  return result;
}

 

function isBalanced(substring) {
  if (substring.length < 2) {
      return false;
  }

  const charSet = new Set(substring);
  if (charSet.size !== 2) {
      return false;
  }

  const chars = Array.from(charSet);
  const count1 = substring.split(chars[0]).length - 1;
  const count2 = substring.split(chars[1]).length - 1;

  return count1 === count2;
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});