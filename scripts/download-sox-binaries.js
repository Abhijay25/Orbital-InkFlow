const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const binaries = [
  {
    name: 'sox-win.exe',
    url: 'https://github.com/chirag04/sox-static/releases/download/v14.4.2/sox-win32.exe',
  },
  {
    name: 'sox-mac',
    url: 'https://github.com/chirag04/sox-static/releases/download/v14.4.2/sox-macos',
  },
  {
    name: 'sox-linux',
    url: 'https://johnvansickle.com/sox/sox-14.4.2-linux-x86_64-static.tar.xz',
    extract: true,
    extractFile: 'sox-14.4.2-linux-x86_64-static/sox',
  },
];

const destDir = path.join(__dirname, '../resources/sox');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      cb(new Error(`Failed to get '${url}' (${response.statusCode})`));
      return;
    }
    response.pipe(file);
    file.on('finish', () => file.close(cb));
  }).on('error', (err) => {
    fs.unlink(dest, () => cb(err));
  });
}

function downloadAndExtractLinux(cb) {
  const tarPath = path.join(destDir, 'sox-linux.tar.xz');
  download(binaries[2].url, tarPath, (err) => {
    if (err) return cb(err);
    try {
      execSync(`tar -xf ${tarPath} -C ${destDir}`);
      fs.copyFileSync(
        path.join(destDir, binaries[2].extractFile),
        path.join(destDir, 'sox-linux')
      );
      fs.chmodSync(path.join(destDir, 'sox-linux'), 0o755);
      fs.rmSync(tarPath);
      fs.rmSync(path.join(destDir, binaries[2].extractFile));
      fs.rmdirSync(path.join(destDir, 'sox-14.4.2-linux-x86_64-static'));
      cb();
    } catch (e) {
      cb(e);
    }
  });
}

function ensureExecutable(file) {
  try {
    fs.chmodSync(file, 0o755);
  } catch {}
}

function main() {
  let pending = binaries.length;
  let failed = false;

  binaries.forEach((bin) => {
    const dest = path.join(destDir, bin.name);
    if (fs.existsSync(dest)) {
      if (bin.name !== 'sox-win.exe') ensureExecutable(dest);
      if (--pending === 0 && !failed) console.log('SoX binaries ready.');
      return;
    }
    if (bin.extract) {
      downloadAndExtractLinux((err) => {
        if (err) {
          failed = true;
          console.error('Failed to download/extract Linux SoX:', err);
        }
        if (--pending === 0 && !failed) console.log('SoX binaries ready.');
      });
    } else {
      download(bin.url, dest, (err) => {
        if (err) {
          failed = true;
          console.error(`Failed to download ${bin.name}:`, err);
        } else {
          if (bin.name !== 'sox-win.exe') ensureExecutable(dest);
        }
        if (--pending === 0 && !failed) console.log('SoX binaries ready.');
      });
    }
  });
}

main(); 