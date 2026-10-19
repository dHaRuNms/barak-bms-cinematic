"""List approved website files or read an exact base64 chunk for connected-GitHub publishing."""
import argparse, base64, hashlib, json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('directory');p.add_argument('--read');p.add_argument('--offset',type=int,default=0);p.add_argument('--size',type=int,default=12288);a=p.parse_args()
root=Path(a.directory).resolve()
if a.read:
 file=(root/a.read).resolve()
 if not file.is_relative_to(root):raise SystemExit('Invalid path')
 with file.open('rb') as f:f.seek(a.offset);data=f.read(a.size)
 print(base64.b64encode(data).decode('ascii'))
else:
 files=[]
 for file in sorted(root.rglob('*')):
  if not file.is_file():continue
  relative=file.relative_to(root)
  if any(x in relative.parts for x in ['node_modules','tmp','.git','.impeccable','test-results','playwright-report','dist']):continue
  if '-proof' in file.name or file.name=='hero-engineering.png':continue
  if relative.parts[:2]==('docs','assets'):continue
  data=file.read_bytes();files.append({'path':str(relative),'bytes':len(data),'sha':hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()})
 print(json.dumps(files))
