# -*- mode: python -*-

block_cipher = None


a = Analysis(['RKB.py'],
             pathex=['src/server/'],
             binaries=[],
             datas=[],
             hiddenimports=[
                 'dns',
                'dns.dnssec',
'dns.e164',
'dns.namedict',
'dns.tsigkeyring',
'dns.rdtypes',
'dns.update',
'dns.version',
'dns.zone',
    'engineio.async_eventlet'
    ],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='RKB',
          debug=False,
          strip=False,
          upx=False,
          console=True )
