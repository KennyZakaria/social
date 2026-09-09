-- MVStore
CREATE ALIAS IF NOT EXISTS READ_BLOB_MAP FOR 'org.h2.tools.Recover.readBlobMap';
CREATE ALIAS IF NOT EXISTS READ_CLOB_MAP FOR 'org.h2.tools.Recover.readClobMap';
-- LOB
CREATE TABLE IF NOT EXISTS INFORMATION_SCHEMA.LOB_BLOCKS(LOB_ID BIGINT, SEQ INT, DATA VARBINARY, PRIMARY KEY(LOB_ID, SEQ));
-- lobMap.size: 0
-- lobData.size: 0
-- Layout
-- chunk.13a = chunk:13a,block:21,len:4,pages:16,livePages:b,max:47b0,liveMax:4e0,map:117,next:25,root:4e80000d6503,time:23b12646,unusedAtVersion:157,version:13a,pinCount:1,toc:3ce2,occupancy:ff0038
-- chunk.143 = chunk:143,block:25,len:9,pages:16,livePages:5,max:a650,liveMax:2020,map:1a4,next:2e,root:50c000203b03,time:28df8c6c,unusedAtVersion:143,version:143,toc:89da,occupancy:bf773a
-- chunk.144 = chunk:144,block:2e,len:c,pages:1e,livePages:0,max:c8e0,liveMax:0,map:20d,next:3a,root:5100002a6f43,time:28df8f04,unused:2968a6d2,unusedAtVersion:17b,version:144,toc:b35b,occupancy:ffffff3f
-- chunk.145 = chunk:145,block:3a,len:b,pages:42,livePages:0,max:bd80,liveMax:0,map:20f,next:45,root:514000264e03,time:28f73638,unused:2968a6d2,unusedAtVersion:17b,version:145,toc:a2f6,occupancy:ffffffffffffffff03
-- chunk.146 = chunk:146,block:8,len:5,pages:11,livePages:0,max:4f80,liveMax:0,map:21b,next:d,root:5180000f7543,time:28f7397d,unused:2968a6d2,unusedAtVersion:17b,version:146,toc:460a,occupancy:ffff01
-- chunk.157 = chunk:157,block:2,len:2,pages:11,livePages:0,max:1e50,liveMax:0,map:21b,next:d,root:55c000032383,time:292494fb,unused:2968a6d2,unusedAtVersion:17b,version:157,toc:1933,occupancy:ffff01
-- chunk.15b = chunk:15b,block:15,len:2,pages:d,livePages:0,max:1e20,liveMax:0,map:21b,next:17,root:56c000036bc3,time:29299798,unused:2968a6d2,unusedAtVersion:17b,version:15b,toc:1a39,occupancy:ff1f
-- chunk.162 = chunk:162,block:48,len:3,pages:f,livePages:0,max:2590,liveMax:0,map:21b,next:4b,root:588000043843,time:292c3830,unused:2968a6d2,unusedAtVersion:17b,version:162,toc:204d,occupancy:ff7f
-- chunk.163 = chunk:163,block:4b,len:3,pages:12,livePages:0,max:2c00,liveMax:0,map:21b,next:4e,root:58c00005bb83,time:292c631d,unused:2968a6d2,unusedAtVersion:17b,version:163,toc:271d,occupancy:ffff03
-- chunk.164 = chunk:164,block:17,len:4,pages:14,livePages:0,max:3950,liveMax:0,map:21b,next:4e,root:5900000837c3,time:292e093f,unused:2968a6d2,unusedAtVersion:17b,version:164,toc:2f8a,occupancy:ffff0f
-- chunk.165 = chunk:165,block:4e,len:4,pages:15,livePages:0,max:4140,liveMax:0,map:21b,next:52,root:5940000a6a43,time:292e41d4,unused:2968a6d2,unusedAtVersion:17b,version:165,toc:3862,occupancy:ffff1f
-- chunk.166 = chunk:166,block:d,len:3,pages:14,livePages:0,max:32c0,liveMax:0,map:21b,next:10,root:598000072343,time:292e75e2,unused:2968a6d2,unusedAtVersion:17b,version:166,toc:2a79,occupancy:ffff0f
-- chunk.167 = chunk:167,block:10,len:3,pages:13,livePages:0,max:35c0,liveMax:0,map:21b,next:45,root:59c000071e83,time:292f2d58,unused:2968a6d2,unusedAtVersion:17b,version:167,toc:2b1d,occupancy:ffff07
-- chunk.168 = chunk:168,block:45,len:3,pages:15,livePages:0,max:3760,liveMax:0,map:21b,next:52,root:5a000007b0c3,time:292f5f6b,unused:2968a6d2,unusedAtVersion:17b,version:168,toc:2e1e,occupancy:ffff1f
-- chunk.169 = chunk:169,block:52,len:3,pages:12,livePages:0,max:30f0,liveMax:0,map:21b,next:55,root:5a4000064803,time:29502049,unused:2968a6d2,unusedAtVersion:17b,version:169,toc:2933,occupancy:ffff03
-- chunk.16b = chunk:16b,block:55,len:4,pages:15,livePages:0,max:3860,liveMax:0,map:21b,next:59,root:5ac00007a603,time:29551586,unused:2968a6d2,unusedAtVersion:17b,version:16b,toc:3016,occupancy:ffff1f
-- chunk.16d = chunk:16d,block:13,len:2,pages:6,livePages:0,max:1ce0,liveMax:0,map:21b,next:59,root:5b4000013a03,time:295619bc,unused:2968a6d2,unusedAtVersion:17b,version:16d,toc:152e,occupancy:3f
-- chunk.16e = chunk:16e,block:59,len:4,pages:18,livePages:0,max:4130,liveMax:0,map:21b,next:5d,root:5b80000797c3,time:2957091e,unused:2968a6d2,unusedAtVersion:17b,version:16e,toc:3095,occupancy:ffffff
-- chunk.170 = chunk:170,block:60,len:3,pages:13,livePages:0,max:3050,liveMax:0,map:21b,next:63,root:5c000005dd45,time:29581902,unused:2968a6d2,unusedAtVersion:17b,version:170,toc:2b45,occupancy:ffff07
-- chunk.171 = chunk:171,block:5d,len:3,pages:a,livePages:0,max:29b0,liveMax:0,map:21b,next:63,root:5c400004a805,time:295ceccf,unused:2968a6d2,unusedAtVersion:17b,version:171,toc:2663,occupancy:ff03
-- chunk.172 = chunk:172,block:63,len:3,pages:b,livePages:0,max:3850,liveMax:0,map:21b,next:66,root:5c800006a685,time:295ea7c8,unused:2968a6d2,unusedAtVersion:17b,version:172,toc:2cf1,occupancy:ff07
-- chunk.173 = chunk:173,block:1b,len:2,pages:5,livePages:0,max:27a0,liveMax:0,map:21d,next:66,root:5cc000037cc5,time:295eae49,unused:2968a6d2,unusedAtVersion:17b,version:173,toc:1f00,occupancy:1f
-- chunk.174 = chunk:174,block:66,len:3,pages:7,livePages:0,max:2930,liveMax:0,map:21d,next:69,root:5d000003d645,time:29604187,unused:2968a6d2,unusedAtVersion:17b,version:174,toc:2318,occupancy:7f
-- chunk.177 = chunk:177,block:6e,len:2,pages:7,livePages:0,max:2320,liveMax:0,map:21d,next:70,root:5dc000017145,time:29605656,unused:2968a6d2,unusedAtVersion:17b,version:177,toc:1dcf,occupancy:7f
-- chunk.179 = chunk:179,block:73,len:3,pages:9,livePages:0,max:2ba0,liveMax:0,map:21d,next:76,root:5e400003d285,time:29606bcb,unused:2968a6d2,unusedAtVersion:17b,version:179,toc:26a5,occupancy:ff01
-- chunk.17a = chunk:17a,block:76,len:3,pages:8,livePages:3,max:25a0,liveMax:b00,map:21d,next:79,root:5e80000289c5,time:29609e89,unusedAtVersion:17b,version:17a,toc:2237,occupancy:e5
-- chunk.17b = chunk:17b,block:79,len:6,pages:b,livePages:7,max:6300,liveMax:4800,map:21d,next:7f,root:5ec00010b505,time:2968a683,unusedAtVersion:17b,version:17b,toc:5a30,occupancy:0107
-- chunk.9b = chunk:9b,block:22,len:4,pages:c,livePages:3,max:3ab0,liveMax:b30,map:79,root:26c0000c2356,time:a634f46,unusedAtVersion:9b,version:9b,toc:359e,occupancy:ff08
-- meta.id = 1
-- root.1 = 5f00003e5647
-- root.100 = 5f0000002b42
-- root.101 = 5f0000003443
-- root.103 = 5f00001498c1
-- root.11 = 5f00002eebcc
-- root.111 = 5f00002f248a
-- root.113 = 5f00002f6f83
-- root.114 = 5f000030ef40
-- root.115 = 5f000030f348
-- root.117 = 5f00003176ca
-- root.12 = 5f00002f4a06
-- root.13 = 5f00002f5cc6
-- root.14 = 5f00002fd496
-- root.17 = 5f0000315d08
-- root.1a = 5f000031f7c2
-- root.1b = 5f000032010c
-- root.1c = 5f0000323908
-- root.1e7 = 5f000037ad09
-- root.1e8 = 5f00003acf82
-- root.1f = 5f0000325704
-- root.2 = 5f0000041909
-- root.210 = 5f00002ec3ca
-- root.213 = 5f00002facca
-- root.216 = 5f000031120e
-- root.219 = 5f0000319c4e
-- root.24 = 5f0000326483
-- root.26 = 5f000034cc06
-- root.27 = 5f000034e216
-- root.36 = 5f0000366c40
-- root.5 = 5f000015ac4b
-- root.60 = 5f000036c294
-- root.62 = 5f00003796c6
-- root.8c = 5f00002ac4c5
-- root.b3 = 5f000035e250
-- root.b4 = 5f0000366242
-- root.b7 = 5f0000367082
-- root.b8 = 5f0000367b80
-- root.b9 = 5f0000367f82
-- root.ba = 5f0000368900
-- root.bb = 5f0000368d00
-- root.bc = 5f0000369082
-- root.bd = 5f0000369a00
-- root.be = 5f0000369e00
-- root.bf = 5f000036a184
-- root.c0 = 5f000036af80
-- root.c1 = 5f000036b382
-- root.c2 = 5f000036be80
-- root.d = 5f00002dc454
-- root.e9 = 5f00003adb41
-- root.ea = 5e800002540c
-- root.fd = 5f00003bd741
-- root.ff = 5f00003cb7c3
-- Meta
-- map.100 = name:table.131,createVersion:138,key:8fa25204,val:6ad869dc
-- map.101 = name:table.135,createVersion:138,key:8fa25204,val:6ad869dc
-- map.103 = name:table.143,createVersion:138,key:8fa25204,val:5803b3f1
-- map.10a = name:index.147,createVersion:138,key:8b92609f,val:921c6892
-- map.10d = name:index.151,createVersion:138,key:8b90f482,val:921c6892
-- map.11 = name:table.27,createVersion:2,key:8fa25204,val:f25aa7b7
-- map.111 = name:index.155,createVersion:138,key:8b8af15d,val:921c6892
-- map.112 = name:index.157,createVersion:138,key:8b8af15d,val:921c6892
-- map.113 = name:index.159,createVersion:138,key:8b8a011f,val:921c6892
-- map.114 = name:index.161,createVersion:138,key:8b8a7940,val:921c6892
-- map.115 = name:index.163,createVersion:138,key:8b8a7940,val:921c6892
-- map.117 = name:index.167,createVersion:138,key:8b8a011f,val:921c6892
-- map.12 = name:table.31,createVersion:2,key:8fa25204,val:5eb2888f
-- map.13 = name:index.32,createVersion:2,key:8b972461,val:e0949836
-- map.14 = name:table.34,createVersion:2,key:8fa25204,val:c6a36c75
-- map.17 = name:index.42,createVersion:2,key:8b8d427a,val:e0949836
-- map.1a = name:index.48,createVersion:2,key:8b8cbb59,val:e0949836
-- map.1b = name:index.50,createVersion:2,key:8b8bd29b,val:e0949836
-- map.1c = name:index.52,createVersion:2,key:8b8be19b,val:e0949836
-- map.1e7 = name:table.169,createVersion:143,key:8fa25204,val:46394956
-- map.1e8 = name:index.172,createVersion:143,key:8ba51e24,val:8e7616b4
-- map.1f = name:index.58,createVersion:2,key:8b890d13,val:e0949836
-- map.1fe = name:table.72,createVersion:143,key:8fa25204,val:6bbc42bf
-- map.1ff = name:index.149,createVersion:143,key:8b9078a3,val:8e7616b4
-- map.2 = name:_
-- map.200 = name:table.139,createVersion:143,key:8fa25204,val:32b6e533
-- map.20d = name:index.142,createVersion:143,key:8b8ade8f,val:8e7616b4
-- map.20e = name:undoLog.1,createVersion:144
-- map.20f = name:undoLog.2,createVersion:144
-- map.210 = name:index.40,createVersion:145,key:8b92555d,val:a0cdd03a
-- map.213 = name:index.46,createVersion:145,key:8b92338f,val:a0cdd03a
-- map.216 = name:index.44,createVersion:145,key:8b8dbaa7,val:a0cdd03a
-- map.219 = name:index.62,createVersion:145,key:8b98f9fe,val:a0cdd03a
-- map.21c = name:undoLog.3,createVersion:172
-- map.21d = name:undoLog.4,createVersion:172
-- map.24 = name:table.3,createVersion:e,key:8fa25204,val:98ba3f23
-- map.26 = name:table.15,createVersion:e,key:8fa25204,val:15d5a01e
-- map.27 = name:table.19,createVersion:e,key:8fa25204,val:42dc6ef9
-- map.3 = name:openTransactions
-- map.36 = name:index.56,createVersion:e,key:8b8b697e,val:e931ddb4
-- map.5 = name:table.0,key:8fa25204,val:5803b3f1
-- map.6 = name:lobMap,key:8fa25204,val:f4470498
-- map.60 = name:table.7,createVersion:7e,key:8fa25204,val:6ad869dc
-- map.62 = name:index.66,createVersion:7e,key:8b8a6dfe,val:debfaf1b
-- map.7 = name:tempLobMap,key:8fa25204,val:59a6a071
-- map.8 = name:lobRef,key:eabe0274,val:35af1558
-- map.8c = name:table.23,createVersion:9b,key:8fa25204,val:c6a36c75
-- map.9 = name:lobData,key:8fa25204,val:59a6a071
-- map.b3 = name:table.10,createVersion:d9,key:8fa25204,val:2efc8306
-- map.b4 = name:index.63,createVersion:d9,key:8b8f1b86,val:dedb0e8f
-- map.b7 = name:table.39,createVersion:d9,key:8fa25204,val:32b6e533
-- map.b8 = name:index.76,createVersion:d9,key:8b8ae25d,val:dedb0e8f
-- map.b9 = name:table.78,createVersion:d9,key:8fa25204,val:32b6e533
-- map.ba = name:index.82,createVersion:d9,key:8b8ae25d,val:dedb0e8f
-- map.bb = name:index.84,createVersion:d9,key:8b8ae61f,val:dedb0e8f
-- map.bc = name:table.86,createVersion:d9,key:8fa25204,val:32b6e533
-- map.bd = name:index.90,createVersion:d9,key:8b8ae25d,val:dedb0e8f
-- map.be = name:index.92,createVersion:d9,key:8b8ae61f,val:dedb0e8f
-- map.bf = name:table.94,createVersion:d9,key:8fa25204,val:ae458082
-- map.c0 = name:index.98,createVersion:d9,key:8b8d2838,val:dedb0e8f
-- map.c1 = name:table.101,createVersion:d9,key:8fa25204,val:32b6e533
-- map.c2 = name:index.105,createVersion:d9,key:8b8ae25d,val:dedb0e8f
-- map.d = name:table.11,createVersion:2,key:8fa25204,val:ae458082
-- map.e9 = name:table.107,createVersion:11e,key:8fa25204,val:98ba3f23
-- map.ea = name:index.110,createVersion:11e,key:8b92428f,val:de2fcc1b
-- map.fa = name:table.68,createVersion:138,key:8fa25204,val:98ba3f23
-- map.fc = name:table.83,createVersion:138,key:8fa25204,val:6cbc638a
-- map.fd = name:table.119,createVersion:138,key:8fa25204,val:32b6e533
-- map.fe = name:table.123,createVersion:138,key:8fa25204,val:32b6e533
-- map.ff = name:table.127,createVersion:138,key:8fa25204,val:5803b3f1
-- name._ = 2
-- name.index.105 = c2
-- name.index.110 = ea
-- name.index.142 = 20d
-- name.index.147 = 10a
-- name.index.149 = 1ff
-- name.index.151 = 10d
-- name.index.155 = 111
-- name.index.157 = 112
-- name.index.159 = 113
-- name.index.161 = 114
-- name.index.163 = 115
-- name.index.167 = 117
-- name.index.172 = 1e8
-- name.index.32 = 13
-- name.index.40 = 210
-- name.index.42 = 17
-- name.index.44 = 216
-- name.index.46 = 213
-- name.index.48 = 1a
-- name.index.50 = 1b
-- name.index.52 = 1c
-- name.index.56 = 36
-- name.index.58 = 1f
-- name.index.62 = 219
-- name.index.63 = b4
-- name.index.66 = 62
-- name.index.76 = b8
-- name.index.82 = ba
-- name.index.84 = bb
-- name.index.90 = bd
-- name.index.92 = be
-- name.index.98 = c0
-- name.lobData = 9
-- name.lobMap = 6
-- name.lobRef = 8
-- name.openTransactions = 3
-- name.table.0 = 5
-- name.table.10 = b3
-- name.table.101 = c1
-- name.table.107 = e9
-- name.table.11 = d
-- name.table.119 = fd
-- name.table.123 = fe
-- name.table.127 = ff
-- name.table.131 = 100
-- name.table.135 = 101
-- name.table.139 = 200
-- name.table.143 = 103
-- name.table.15 = 26
-- name.table.169 = 1e7
-- name.table.19 = 27
-- name.table.23 = 8c
-- name.table.27 = 11
-- name.table.3 = 24
-- name.table.31 = 12
-- name.table.34 = 14
-- name.table.39 = b7
-- name.table.68 = fa
-- name.table.7 = 60
-- name.table.72 = 1fe
-- name.table.78 = b9
-- name.table.83 = fc
-- name.table.86 = bc
-- name.table.94 = bf
-- name.tempLobMap = 7
-- name.undoLog.1 = 20e
-- name.undoLog.2 = 20f
-- name.undoLog.3 = 21c
-- name.undoLog.4 = 21d
-- Types
-- 1110ca70 = org.h2.mvstore.tx.VersionedValueType@1110ca70
-- 128a188a = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 15d5a01e = org.h2.mvstore.tx.VersionedValueType@15d5a01e
-- 1c98fe6f = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 1fc2a7ec = org.h2.mvstore.tx.VersionedValueType@1fc2a7ec
-- 265d65fc = org.h2.mvstore.tx.VersionedValueType@265d65fc
-- 2919aff3 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 2919b385 = org.h2.mvstore.tx.VersionedValueType@2919b385
-- 2a510e0e = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 2b44e768 = org.h2.mvstore.tx.VersionedValueType@2b44e768
-- 2d2f09a4 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 2efc8306 = org.h2.mvstore.tx.VersionedValueType@2efc8306
-- 2f70df11 = org.h2.mvstore.tx.VersionedValueType@2f70df11
-- 300942b2 = org.h2.mvstore.tx.VersionedValueType@300942b2
-- 31e3c34 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 32b6e533 = org.h2.mvstore.tx.VersionedValueType@32b6e533
-- 35af1558 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 36120a8b = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 38394dc3 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 3843a578 = org.h2.mvstore.tx.VersionedValueType@3843a578
-- 3a3bc0da = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 3af39e7b = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 3c0a50da = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 3c7fac3e = org.h2.mvstore.tx.VersionedValueType@3c7fac3e
-- 40a84c09 = org.h2.mvstore.tx.VersionedValueType@40a84c09
-- 42dc6ef9 = org.h2.mvstore.tx.VersionedValueType@42dc6ef9
-- 4466dd36 = org.h2.mvstore.tx.VersionedValueType@4466dd36
-- 44d84313 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 46394956 = org.h2.mvstore.tx.VersionedValueType@46394956
-- 4727e5fc = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 48f3eb48 = org.h2.mvstore.tx.VersionedValueType@48f3eb48
-- 4b511e61 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 4c614d8c = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 50e8ed74 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 513ddd6d = org.h2.mvstore.tx.VersionedValueType@513ddd6d
-- 540212be = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 54ae1240 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 551bdc27 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 57678f26 = org.h2.mvstore.tx.VersionedValueType@57678f26
-- 5803b3f1 = org.h2.mvstore.tx.VersionedValueType@5803b3f1
-- 58fdd99 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 59a6a071 = org.h2.mvstore.type.ByteArrayDataType@59a6a071
-- 5b4d9bda = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 5d67b2b3 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 5eb2888f = org.h2.mvstore.tx.VersionedValueType@5eb2888f
-- 6386149d = org.h2.mvstore.tx.VersionedValueType@6386149d
-- 646be2c3 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 651d6e2e = org.h2.mvstore.tx.VersionedValueType@651d6e2e
-- 688d2a5d = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 68f69ca3 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 6ad869dc = org.h2.mvstore.tx.VersionedValueType@6ad869dc
-- 6bbc42bf = org.h2.mvstore.tx.VersionedValueType@6bbc42bf
-- 6cbc638a = org.h2.mvstore.tx.VersionedValueType@6cbc638a
-- 70f5f57d = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 71f056a = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 75e28af4 = org.h2.mvstore.tx.VersionedValueType@75e28af4
-- 75f65d54 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 772315c7 = org.h2.mvstore.tx.VersionedValueType@772315c7
-- 772624af = org.h2.mvstore.tx.VersionedValueType@772624af
-- 7af9595d = org.h2.mvstore.db.NullValueDataType@5ebec15
-- 80205149 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 81399fd0 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 81959f2e = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 85d3601a = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 8613cdba = org.h2.mvstore.tx.VersionedValueType@8613cdba
-- 885c3fdd = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 8b890d13 = org.h2.mvstore.db.RowDataType@8b890d13
-- 8b8a011f = org.h2.mvstore.db.RowDataType@8b8a011f
-- 8b8a6dfe = org.h2.mvstore.db.RowDataType@8b8a6dfe
-- 8b8a7940 = org.h2.mvstore.db.RowDataType@8b8a7940
-- 8b8ade8f = org.h2.mvstore.db.RowDataType@8b8ade8f
-- 8b8ae25d = org.h2.mvstore.db.RowDataType@8b8ae25d
-- 8b8ae61f = org.h2.mvstore.db.RowDataType@8b8ae61f
-- 8b8af15d = org.h2.mvstore.db.RowDataType@8b8af15d
-- 8b8b697e = org.h2.mvstore.db.RowDataType@8b8b697e
-- 8b8bd29b = org.h2.mvstore.db.RowDataType@8b8bd29b
-- 8b8be19b = org.h2.mvstore.db.RowDataType@8b8be19b
-- 8b8cbb59 = org.h2.mvstore.db.RowDataType@8b8cbb59
-- 8b8d2838 = org.h2.mvstore.db.RowDataType@8b8d2838
-- 8b8d427a = org.h2.mvstore.db.RowDataType@8b8d427a
-- 8b8d4a0a = org.h2.mvstore.db.RowDataType@8b8d4a0a
-- 8b8db6d9 = org.h2.mvstore.db.RowDataType@8b8db6d9
-- 8b8dbaa7 = org.h2.mvstore.db.RowDataType@8b8dbaa7
-- 8b8dbe69 = org.h2.mvstore.db.RowDataType@8b8dbe69
-- 8b8dc227 = org.h2.mvstore.db.RowDataType@8b8dc227
-- 8b8e2b38 = org.h2.mvstore.db.RowDataType@8b8e2b38
-- 8b8e32c8 = org.h2.mvstore.db.RowDataType@8b8e32c8
-- 8b8e9f97 = org.h2.mvstore.db.RowDataType@8b8e9f97
-- 8b8ea727 = org.h2.mvstore.db.RowDataType@8b8ea727
-- 8b8f13f6 = org.h2.mvstore.db.RowDataType@8b8f13f6
-- 8b8f1b86 = org.h2.mvstore.db.RowDataType@8b8f1b86
-- 8b8f8855 = org.h2.mvstore.db.RowDataType@8b8f8855
-- 8b8f8fe5 = org.h2.mvstore.db.RowDataType@8b8f8fe5
-- 8b8ffcb4 = org.h2.mvstore.db.RowDataType@8b8ffcb4
-- 8b900444 = org.h2.mvstore.db.RowDataType@8b900444
-- 8b907113 = org.h2.mvstore.db.RowDataType@8b907113
-- 8b9078a3 = org.h2.mvstore.db.RowDataType@8b9078a3
-- 8b90e572 = org.h2.mvstore.db.RowDataType@8b90e572
-- 8b90f482 = org.h2.mvstore.db.RowDataType@8b90f482
-- 8b9159d1 = org.h2.mvstore.db.RowDataType@8b9159d1
-- 8b91ce30 = org.h2.mvstore.db.RowDataType@8b91ce30
-- 8b92338f = org.h2.mvstore.db.RowDataType@8b92338f
-- 8b92428f = org.h2.mvstore.db.RowDataType@8b92428f
-- 8b92555d = org.h2.mvstore.db.RowDataType@8b92555d
-- 8b92609f = org.h2.mvstore.db.RowDataType@8b92609f
-- 8b9363ab = org.h2.mvstore.db.RowDataType@8b9363ab
-- 8b93d80a = org.h2.mvstore.db.RowDataType@8b93d80a
-- 8b944c69 = org.h2.mvstore.db.RowDataType@8b944c69
-- 8b94c0c8 = org.h2.mvstore.db.RowDataType@8b94c0c8
-- 8b953527 = org.h2.mvstore.db.RowDataType@8b953527
-- 8b95a986 = org.h2.mvstore.db.RowDataType@8b95a986
-- 8b961de5 = org.h2.mvstore.db.RowDataType@8b961de5
-- 8b969244 = org.h2.mvstore.db.RowDataType@8b969244
-- 8b9706a3 = org.h2.mvstore.db.RowDataType@8b9706a3
-- 8b972461 = org.h2.mvstore.db.RowDataType@8b972461
-- 8b977b02 = org.h2.mvstore.db.RowDataType@8b977b02
-- 8b97ef61 = org.h2.mvstore.db.RowDataType@8b97ef61
-- 8b9863c0 = org.h2.mvstore.db.RowDataType@8b9863c0
-- 8b98d81f = org.h2.mvstore.db.RowDataType@8b98d81f
-- 8b98f9fe = org.h2.mvstore.db.RowDataType@8b98f9fe
-- 8b994c7e = org.h2.mvstore.db.RowDataType@8b994c7e
-- 8b99c0dd = org.h2.mvstore.db.RowDataType@8b99c0dd
-- 8b9a353c = org.h2.mvstore.db.RowDataType@8b9a353c
-- 8b9aa99b = org.h2.mvstore.db.RowDataType@8b9aa99b
-- 8b9b1dfa = org.h2.mvstore.db.RowDataType@8b9b1dfa
-- 8b9b9259 = org.h2.mvstore.db.RowDataType@8b9b9259
-- 8b9c06b8 = org.h2.mvstore.db.RowDataType@8b9c06b8
-- 8b9c7b17 = org.h2.mvstore.db.RowDataType@8b9c7b17
-- 8b9cef76 = org.h2.mvstore.db.RowDataType@8b9cef76
-- 8b9d63d5 = org.h2.mvstore.db.RowDataType@8b9d63d5
-- 8b9dd834 = org.h2.mvstore.db.RowDataType@8b9dd834
-- 8b9e4c93 = org.h2.mvstore.db.RowDataType@8b9e4c93
-- 8b9ec0f2 = org.h2.mvstore.db.RowDataType@8b9ec0f2
-- 8b9f3551 = org.h2.mvstore.db.RowDataType@8b9f3551
-- 8b9fa9b0 = org.h2.mvstore.db.RowDataType@8b9fa9b0
-- 8ba01e0f = org.h2.mvstore.db.RowDataType@8ba01e0f
-- 8ba0926e = org.h2.mvstore.db.RowDataType@8ba0926e
-- 8ba106cd = org.h2.mvstore.db.RowDataType@8ba106cd
-- 8ba17b2c = org.h2.mvstore.db.RowDataType@8ba17b2c
-- 8ba1ef8b = org.h2.mvstore.db.RowDataType@8ba1ef8b
-- 8ba263ea = org.h2.mvstore.db.RowDataType@8ba263ea
-- 8ba2d849 = org.h2.mvstore.db.RowDataType@8ba2d849
-- 8ba34ca8 = org.h2.mvstore.db.RowDataType@8ba34ca8
-- 8ba3c107 = org.h2.mvstore.db.RowDataType@8ba3c107
-- 8ba43566 = org.h2.mvstore.db.RowDataType@8ba43566
-- 8ba4a9c5 = org.h2.mvstore.db.RowDataType@8ba4a9c5
-- 8ba51e24 = org.h2.mvstore.db.RowDataType@8ba51e24
-- 8d7eabcc = org.h2.mvstore.tx.VersionedValueType@8d7eabcc
-- 8e7616b4 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 8fa25204 = org.h2.mvstore.type.LongDataType@8fa25204
-- 915e803b = org.h2.mvstore.tx.VersionedValueType@915e803b
-- 91e3ce7d = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 921c6892 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 98ba3f23 = org.h2.mvstore.tx.VersionedValueType@98ba3f23
-- 995ac0e2 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- 9d2f6ed2 = org.h2.mvstore.tx.VersionedValueType@9d2f6ed2
-- 9e6a930f = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- a0cdd03a = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- a2fd44e4 = org.h2.mvstore.tx.VersionedValueType@a2fd44e4
-- a3d07edf = org.h2.mvstore.tx.VersionedValueType@a3d07edf
-- a4450460 = org.h2.mvstore.tx.VersionedValueType@a4450460
-- a47dc3d7 = org.h2.mvstore.tx.VersionedValueType@a47dc3d7
-- a5ce7813 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- a608f9a7 = org.h2.mvstore.tx.VersionedValueType@a608f9a7
-- a6913b43 = org.h2.mvstore.tx.VersionedValueType@a6913b43
-- a7c220e9 = org.h2.mvstore.tx.VersionedValueType@a7c220e9
-- ad369c5b = org.h2.mvstore.tx.VersionedValueType@ad369c5b
-- ae458082 = org.h2.mvstore.tx.VersionedValueType@ae458082
-- afc2d433 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- b144175 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- b1506fad = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- b163aca2 = org.h2.mvstore.tx.VersionedValueType@b163aca2
-- b842275 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- bdb6a733 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- bdcd11cd = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- be083e1 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- c467a665 = org.h2.mvstore.tx.VersionedValueType@c467a665
-- c6268614 = org.h2.mvstore.tx.VersionedValueType@c6268614
-- c6a36c75 = org.h2.mvstore.tx.VersionedValueType@c6a36c75
-- c7b195e4 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- c9a37301 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- ca657995 = org.h2.mvstore.tx.VersionedValueType@ca657995
-- cba585e1 = org.h2.mvstore.tx.VersionedValueType@cba585e1
-- d0b450f7 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- d11a8faa = org.h2.mvstore.tx.VersionedValueType@d11a8faa
-- d18848c4 = org.h2.mvstore.tx.VersionedValueType@d18848c4
-- d2248804 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- d625b15a = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- db4680dc = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- de2fcc1b = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- debfaf1b = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- dedb0e8f = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- e0949836 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- e246d64b = org.h2.mvstore.tx.VersionedValueType@e246d64b
-- e32987e5 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- e497a19 = org.h2.mvstore.tx.VersionedValueType@e497a19
-- e59b9101 = org.h2.mvstore.tx.VersionedValueType@e59b9101
-- e7d0db2 = org.h2.mvstore.db.NullValueDataType@5ebec15
-- e931ddb4 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- eabe0274 = org.h2.mvstore.db.LobStorageMap$BlobReference$Type@eabe0274
-- ed02c0ad = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- ef004db4 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- efc81315 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- f25aa7b7 = org.h2.mvstore.tx.VersionedValueType@f25aa7b7
-- f2e6da2b = org.h2.mvstore.tx.VersionedValueType@f2e6da2b
-- f4470498 = org.h2.mvstore.db.LobStorageMap$BlobMeta$Type@f4470498
-- f54c0b7d = org.h2.mvstore.tx.VersionedValueType@f54c0b7d
-- f81484ca = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- fc22229d = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- fc8de153 = org.h2.mvstore.tx.VersionedValueType@fc8de153
-- fd49c790 = org.h2.mvstore.tx.VersionedValueType@fd49c790
-- ff6a8360 = org.h2.mvstore.tx.VersionedValueType@d0d0617b
-- Tables
---- Schema SET ----
SET CREATE_BUILD 240;
---- Table Data ----
CREATE TABLE O_94(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR);
INSERT INTO O_94 VALUES(1, 130, 219.00, 500.00, 52.00, 123.00, 85.00, 55.00, 522.00, 11.00, 22.00);
CREATE TABLE O_119(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR);
INSERT INTO O_119 VALUES(122, '', '', FALSE, U&'Carte sp\00e9ciale', 1);
INSERT INTO O_119 VALUES(123, '', '', FALSE, 'Carte fraternelle', 1);
INSERT INTO O_119 VALUES(124, '', '', FALSE, 'A.M.C.', 1);
INSERT INTO O_119 VALUES(140, '', '', FALSE, U&'Carte sp\00e9ciale', 34);
INSERT INTO O_119 VALUES(141, '', '', FALSE, 'Carte fraternelle', 34);
INSERT INTO O_119 VALUES(142, '', '', FALSE, 'A.M.C.', 34);
INSERT INTO O_119 VALUES(143, '', '', FALSE, U&'Carte sp\00e9ciale', 35);
INSERT INTO O_119 VALUES(144, '', '', FALSE, 'Carte fraternelle', 35);
INSERT INTO O_119 VALUES(145, '', '', FALSE, 'A.M.C.', 35);
INSERT INTO O_119 VALUES(146, '', '', FALSE, U&'Carte sp\00e9ciale', 36);
INSERT INTO O_119 VALUES(147, '', '', FALSE, 'Carte fraternelle', 36);
INSERT INTO O_119 VALUES(148, '', '', FALSE, 'A.M.C.', 36);
INSERT INTO O_119 VALUES(155, '', '', FALSE, U&'Carte sp\00e9ciale', 37);
INSERT INTO O_119 VALUES(156, '', '', FALSE, 'Carte fraternelle', 37);
INSERT INTO O_119 VALUES(157, '', '', FALSE, 'A.M.C.', 37);
INSERT INTO O_119 VALUES(158, '', '', FALSE, U&'Carte sp\00e9ciale', 38);
INSERT INTO O_119 VALUES(159, '', '', FALSE, 'Carte fraternelle', 38);
INSERT INTO O_119 VALUES(160, '', '', FALSE, 'A.M.C.', 38);
INSERT INTO O_119 VALUES(161, '', '', FALSE, U&'Carte sp\00e9ciale', 39);
INSERT INTO O_119 VALUES(162, '', '', FALSE, 'Carte fraternelle', 39);
INSERT INTO O_119 VALUES(163, '', '', FALSE, 'A.M.C.', 39);
INSERT INTO O_119 VALUES(164, '', '', FALSE, U&'Carte sp\00e9ciale', 40);
INSERT INTO O_119 VALUES(165, '', '', FALSE, 'Carte fraternelle', 40);
INSERT INTO O_119 VALUES(166, '', '', FALSE, 'A.M.C.', 40);
INSERT INTO O_119 VALUES(167, '', '', FALSE, U&'Carte sp\00e9ciale', 41);
INSERT INTO O_119 VALUES(168, '', '', FALSE, 'Carte fraternelle', 41);
INSERT INTO O_119 VALUES(169, '', '', FALSE, 'A.M.C.', 41);
INSERT INTO O_119 VALUES(170, '', '', FALSE, U&'Carte sp\00e9ciale', 42);
INSERT INTO O_119 VALUES(171, '', '', FALSE, 'Carte fraternelle', 42);
INSERT INTO O_119 VALUES(172, '', '', FALSE, 'A.M.C.', 42);
INSERT INTO O_119 VALUES(179, '', '', FALSE, U&'Carte sp\00e9ciale', 43);
INSERT INTO O_119 VALUES(180, '', '', FALSE, 'Carte fraternelle', 43);
INSERT INTO O_119 VALUES(181, '', '', FALSE, 'A.M.C.', 43);
INSERT INTO O_119 VALUES(185, '', '', FALSE, U&'Carte sp\00e9ciale', 33);
INSERT INTO O_119 VALUES(186, '', '', FALSE, 'Carte fraternelle', 33);
INSERT INTO O_119 VALUES(187, '', '', FALSE, 'A.M.C.', 33);
CREATE TABLE O_10(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR);
INSERT INTO O_10 VALUES(72, 'oued fes', 'cd212365', DATE '2000-02-02', 'VEUVE', 'brahmi', 50.0, 'souad', '0645128752', 2, 2, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(73, 'oued fes', 'cd2123', DATE '2000-02-02', 'PERE', 'ayadech', 50.0, 'khalil', '0645128720', 2, 2, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(104, 'www', 'wwwww', NULL, 'wwww', 'www', NULL, 'www', NULL, 2, 1, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(136, 'fes', 'cd12365', DATE '1990-03-12', 'fils', 'ayadech', 50.0, 'salah', '0645125212', 2, 1, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(137, 'fes', 'cd21455', DATE '2000-02-02', 'veuve', 'btmi', 50.0, 'fatima', '06452125', 2, 1, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(138, 'fes', 'cd123565', DATE '2000-02-20', 'VEUVE', 'maroi', 50.0, 'brh', '0645125252', 2, 34, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(139, 'fes', 'cd123256', DATE '2003-02-02', 'FILS', 'amine', 50.0, 'ayadech', '06452152', 2, 34, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(168, 'fes', 'cd125254', DATE '2012-02-15', 'FILLE', 'ayadech', 0.0, 'mohamed', NULL, 2, 34, NULL, NULL, NULL, NULL);
INSERT INTO O_10 VALUES(232, NULL, 'aa', DATE '2026-09-13', 'FILS', 'a', NULL, 'aa', '<', 1, 67, '44', 'f', '<ss<d', '<<');
CREATE TABLE O_34(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR);
INSERT INTO O_34 VALUES(1, TRUE, TIMESTAMP '2026-09-01 10:17:33.695845', 'admin@social.local', 'Administrateur Service Social', '$2a$10$xU2NPnEWiCLNHba6jHNTUOxngctdO1Z3eh/55TMqdNl.1Ie9pRjCe', 1, 'admin');
INSERT INTO O_34 VALUES(2, TRUE, TIMESTAMP '2026-09-01 10:17:33.838846', 'manager@social.local', 'Responsable Service Social', '$2a$10$BnSjOPKBJFWqU6YHrA0Nw.WwmBziGuTsh/4UYIRWhWn0z8MXGsATG', 3, 'manager');
INSERT INTO O_34 VALUES(3, TRUE, TIMESTAMP '2026-09-01 10:17:33.918843', 'agent.bureau@social.local', 'Agent Bureau d''Ordre', '$2a$10$TdBAVdhhJ2V/9Rf5ibHXzeO.drQUZUQNLi9kLXKpTtd8B34zBtWz6', 2, 'agent.bureau');
INSERT INTO O_34 VALUES(4, TRUE, TIMESTAMP '2026-09-01 10:17:34.023845', 'agent.mutuelle@social.local', 'Agent Section Mutuelle', '$2a$10$firqlC9g2z9pm1z4CjoOke3ay2L/4Nelifkt8/WtncVNcTTGQOpg6', 2, 'agent.mutuelle');
INSERT INTO O_34 VALUES(5, TRUE, TIMESTAMP '2026-09-01 10:17:34.093843', 'agent.assistance@social.local', 'Agent Assistance Sociale', '$2a$10$2NrjDvBYmSFpIS2Vuvrrj.AecClMQK/SkKh2hvPWI0odmDgnI2G1W', 2, 'agent.assistance');
INSERT INTO O_34 VALUES(6, TRUE, TIMESTAMP '2026-09-01 10:17:34.158848', 'agent.retraites@social.local', 'Agent Section Retraites', '$2a$10$MArx7Nx4FFCAb49QTyAN5uyTEaFYqWIJwshAxs0W3Ta.bHpGHjnsS', 2, 'agent.retraites');
INSERT INTO O_34 VALUES(7, TRUE, TIMESTAMP '2026-09-01 10:17:34.220474', 'agent.deces@social.local', U&'Agent Section D\00e9c\00e8s', '$2a$10$cKUkzW/easQFWB0ag5yQ2upckYgvvk/xpc5Xf8md8.Mq9V3d/n.E2', 2, 'agent.deces');
INSERT INTO O_34 VALUES(8, TRUE, TIMESTAMP '2026-09-01 10:17:34.281475', 'agent.culture@social.local', 'Agent Culture et Loisirs', '$2a$10$BQDBpInngipbTf6m7TPbJOXpDXWogbMCi0RcoFBk4uTOVVmMw58.S', 2, 'agent.culture');
CREATE TABLE O_78(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR);
INSERT INTO O_78 VALUES(2, 130, NULL, 'VEUVE_VEUF', '122', 500.00);
CREATE TABLE O_39(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR);
INSERT INTO O_39 VALUES(2, 130, 'CAPITAL_DECES', 12.00, 'moi', 'cdvs');
CREATE TABLE O_101(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR);
INSERT INTO O_101 VALUES(2, 130, 'AGREMENT', 500.00, DATE '2026-02-02', 'n1422345');
CREATE TABLE O_143(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR);
INSERT INTO O_143 VALUES(122, 'Pension de retraite', 0.00, 1);
INSERT INTO O_143 VALUES(123, U&'Pension de r\00e9forme', 0.00, 1);
INSERT INTO O_143 VALUES(124, 'Autres ressources', 0.00, 1);
INSERT INTO O_143 VALUES(140, 'Pension de retraite', 0.00, 34);
INSERT INTO O_143 VALUES(141, U&'Pension de r\00e9forme', 0.00, 34);
INSERT INTO O_143 VALUES(142, 'Autres ressources', 0.00, 34);
INSERT INTO O_143 VALUES(143, 'Pension de retraite', 0.00, 35);
INSERT INTO O_143 VALUES(144, U&'Pension de r\00e9forme', 0.00, 35);
INSERT INTO O_143 VALUES(145, 'Autres ressources', 0.00, 35);
INSERT INTO O_143 VALUES(146, 'Pension de retraite', 0.00, 36);
INSERT INTO O_143 VALUES(147, U&'Pension de r\00e9forme', 0.00, 36);
INSERT INTO O_143 VALUES(148, 'Autres ressources', 0.00, 36);
INSERT INTO O_143 VALUES(155, 'Pension de retraite', 0.00, 37);
INSERT INTO O_143 VALUES(156, U&'Pension de r\00e9forme', 0.00, 37);
INSERT INTO O_143 VALUES(157, 'Autres ressources', 0.00, 37);
INSERT INTO O_143 VALUES(158, 'Pension de retraite', 0.00, 38);
INSERT INTO O_143 VALUES(159, U&'Pension de r\00e9forme', 0.00, 38);
INSERT INTO O_143 VALUES(160, 'Autres ressources', 0.00, 38);
INSERT INTO O_143 VALUES(161, 'Pension de retraite', 0.00, 39);
INSERT INTO O_143 VALUES(162, U&'Pension de r\00e9forme', 0.00, 39);
INSERT INTO O_143 VALUES(163, 'Autres ressources', 0.00, 39);
INSERT INTO O_143 VALUES(164, 'Pension de retraite', 0.00, 40);
INSERT INTO O_143 VALUES(165, U&'Pension de r\00e9forme', 0.00, 40);
INSERT INTO O_143 VALUES(166, 'Autres ressources', 0.00, 40);
INSERT INTO O_143 VALUES(167, 'Pension de retraite', 0.00, 41);
INSERT INTO O_143 VALUES(168, U&'Pension de r\00e9forme', 0.00, 41);
INSERT INTO O_143 VALUES(169, 'Autres ressources', 0.00, 41);
INSERT INTO O_143 VALUES(170, 'Pension de retraite', 0.00, 42);
INSERT INTO O_143 VALUES(171, U&'Pension de r\00e9forme', 0.00, 42);
INSERT INTO O_143 VALUES(172, 'Autres ressources', 0.00, 42);
INSERT INTO O_143 VALUES(179, 'Pension de retraite', 0.00, 43);
INSERT INTO O_143 VALUES(180, U&'Pension de r\00e9forme', 0.00, 43);
INSERT INTO O_143 VALUES(181, 'Autres ressources', 0.00, 43);
INSERT INTO O_143 VALUES(185, 'Pension de retraite', 0.00, 33);
INSERT INTO O_143 VALUES(186, U&'Pension de r\00e9forme', 0.00, 33);
INSERT INTO O_143 VALUES(187, 'Autres ressources', 0.00, 33);
CREATE TABLE O_86(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR);
INSERT INTO O_86 VALUES(2, 130, NULL, 'ORPHELIN', 'n1254', 400.00);
CREATE TABLE O_107(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR);
INSERT INTO O_107 VALUES(1, 1, 'mort', DATE '2026-08-19', '999922', 'fes', 'Naturelle', 'khaldi amine', 'DEC-2026-00001', 'khaldi', 'ARCHIVE', TIMESTAMP '2026-09-03 10:42:11.942885', TIMESTAMP '2026-09-04 11:19:19.917444', NULL, NULL, NULL, NULL, U&'Dossier archiv\00e9', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(130, 34, 'tomobile', DATE '2026-09-02', '123365', 'agadire', 'Accidentelle', 'barada ayman', 'DEC-2026-00002', 'mort', 'A_VALIDER', TIMESTAMP '2026-09-03 10:42:11.942885', TIMESTAMP '2026-09-04 08:44:09.939541', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(131, 35, 'Cause naturelle', DATE '2026-08-10', 'DPR-001', 'Rabat', 'Naturelle', 'El Amrani Yassine', 'DEC-2026-00003', 'Dossier test en cours', 'INCOMPLET', TIMESTAMP '2026-09-03 11:06:22.298243', TIMESTAMP '2026-09-03 14:52:38.441796', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(132, 36, 'Accident de route', DATE '2026-08-14', 'DPR-002', 'Casablanca', 'Accidentelle', 'Benali Meryem', 'DEC-2026-00004', 'Dossier test a valider', 'A_VALIDER', TIMESTAMP '2026-09-03 11:06:22.328327', TIMESTAMP '2026-09-03 11:06:22.339322', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(133, 37, 'Maladie', DATE '2026-08-18', 'DPR-003', 'Fes', 'Naturelle', 'Khaldi Omar', 'DEC-2026-00005', 'Dossier test incomplet', 'INCOMPLET', TIMESTAMP '2026-09-03 11:06:22.358322', TIMESTAMP '2026-09-03 11:06:22.37532', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(134, 38, 'Accident domestique', DATE '2026-08-22', 'DPR-004', 'Marrakech', 'Accidentelle', 'Mansouri Sara', 'DEC-2026-00006', 'Dossier test rejete', 'A_VALIDER', TIMESTAMP '2026-09-03 11:06:22.404324', TIMESTAMP '2026-09-03 11:06:22.416321', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(135, 39, 'Cause naturelle', DATE '2026-08-28', 'DPR-005', 'Tanger', 'Naturelle', 'Ziani Nabil', 'DEC-2026-00007', 'Dossier test valide', 'A_VALIDER', TIMESTAMP '2026-09-03 11:07:40.970784', TIMESTAMP '2026-09-03 11:07:41.004784', NULL, NULL, NULL, NULL, 'Changement manuel du statut', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(163, 2, 'tomobile', DATE '2026-09-03', '123655', 'markech', 'Naturelle', 'ayadech salah', 'DEC-2026-00008', 'tomobilr', 'VALIDE', TIMESTAMP '2026-09-03 11:17:57.953013', TIMESTAMP '2026-09-03 14:22:56.373936', TIMESTAMP '2026-09-03 14:22:56.372936', NULL, 'agent.deces', NULL, U&'Validation depuis la page d\00e9tail', NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(195, 40, 'mort', DATE '2026-09-03', '12345', 'khribga', 'Naturelle', 'Rachidi Imane', 'DEC-2026-00009', 'sssss', 'EN_COURS', TIMESTAMP '2026-09-03 14:10:25.901844', TIMESTAMP '2026-09-03 14:51:29.518772', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(227, 41, 'ser', DATE '2026-09-03', '1321', 'fes', 'Accidentelle', 'Alaoui Hicham', 'DEC-2026-00010', 'malade', 'VALIDE', TIMESTAMP '2026-09-04 10:48:47.344411', TIMESTAMP '2026-09-04 10:50:19.207498', TIMESTAMP '2026-09-04 10:50:19.206497', NULL, 'agent.deces', NULL, U&'Validation depuis la page d\00e9tail', TIMESTAMP '2026-09-04 10:50:11.18661', NULL, 'agent.deces', NULL);
INSERT INTO O_107 VALUES(231, 42, 'aa', DATE '2026-09-04', 'aa31', 'as', 'Naturelle', 'Berrada Kawtar', 'DEC-2026-00011', 'asaa', 'EN_COURS', TIMESTAMP '2026-09-04 11:08:03.527395', TIMESTAMP '2026-09-04 11:08:03.527395', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO O_107 VALUES(259, 67, 'naturelle', DATE '2026-09-09', '124785', 'fes', 'Naturelle', 'bmd OUSSAMA', 'DEC-2026-00012', 'cc', 'CLOTURE', TIMESTAMP '2026-09-09 11:05:20.457148', TIMESTAMP '2026-09-09 11:07:29.214237', TIMESTAMP '2026-09-09 11:07:16.285797', TIMESTAMP '2026-09-09 11:07:29.212231', 'manager', 'manager', U&'Dossier cl\00f4tur\00e9', TIMESTAMP '2026-09-09 11:07:14.147026', NULL, 'manager', NULL);
CREATE TABLE O_23(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR);
INSERT INTO O_23 VALUES(1, 130, 'MODIFICATION', 'EN_COURS', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 10:58:05.266124');
INSERT INTO O_23 VALUES(2, 131, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:06:22.300238');
INSERT INTO O_23 VALUES(3, 132, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:06:22.328327');
INSERT INTO O_23 VALUES(4, 132, 'MODIFICATION', 'EN_COURS', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 11:06:22.33832');
INSERT INTO O_23 VALUES(5, 133, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:06:22.358322');
INSERT INTO O_23 VALUES(6, 133, 'MODIFICATION', 'EN_COURS', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 11:06:22.365321');
INSERT INTO O_23 VALUES(7, 133, 'MODIFICATION', 'A_VALIDER', 'INCOMPLET', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 11:06:22.373322');
INSERT INTO O_23 VALUES(8, 134, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:06:22.405323');
INSERT INTO O_23 VALUES(9, 134, 'MODIFICATION', 'EN_COURS', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 11:06:22.415324');
INSERT INTO O_23 VALUES(11, 135, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:07:40.971784');
INSERT INTO O_23 VALUES(12, 135, 'MODIFICATION', 'EN_COURS', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 11:07:41.003785');
INSERT INTO O_23 VALUES(33, 163, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 11:17:57.966022');
INSERT INTO O_23 VALUES(65, 195, 'CREATION', NULL, 'EN_COURS', 'Creation du dossier', 'system', TIMESTAMP '2026-09-03 14:10:25.904844');
INSERT INTO O_23 VALUES(66, 163, 'MODIFICATION', 'EN_COURS', 'EN_COURS', 'Modification des informations du dossier', 'system', TIMESTAMP '2026-09-03 14:14:52.71851');
INSERT INTO O_23 VALUES(67, 163, 'MODIFICATION', 'EN_COURS', 'EN_COURS', 'Modification des informations du dossier', 'system', TIMESTAMP '2026-09-03 14:22:35.120697');
INSERT INTO O_23 VALUES(68, 163, 'SOUMISSION_VALIDATION', 'EN_COURS', 'A_VALIDER', 'Dossier soumis a validation', 'agent.deces', TIMESTAMP '2026-09-03 14:22:49.740255');
INSERT INTO O_23 VALUES(69, 163, 'VALIDATION', 'A_VALIDER', 'VALIDE', U&'Validation depuis la page d\00e9tail', 'agent.deces', TIMESTAMP '2026-09-03 14:22:56.372936');
INSERT INTO O_23 VALUES(70, 195, 'MODIFICATION', 'EN_COURS', 'EN_COURS', 'Modification des informations du dossier', 'system', TIMESTAMP '2026-09-03 14:51:29.516772');
INSERT INTO O_23 VALUES(71, 131, 'MODIFICATION', 'EN_COURS', 'INCOMPLET', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-03 14:52:38.439797');
INSERT INTO O_23 VALUES(97, 130, 'MODIFICATION', 'A_VALIDER', 'A_VALIDER', 'Modification des informations du dossier', 'system', TIMESTAMP '2026-09-04 08:44:09.91754');
INSERT INTO O_23 VALUES(98, 130, 'MODIFICATION', 'A_VALIDER', 'A_VALIDER', 'Changement manuel du statut', 'system', TIMESTAMP '2026-09-04 08:57:01.224388');
INSERT INTO O_23 VALUES(129, 1, 'EXPORT_FICHE_PDF', NULL, NULL, 'Export de la fiche PDF', 'system', TIMESTAMP '2026-09-04 09:07:40.392957');
INSERT INTO O_23 VALUES(161, 130, 'MODIFICATION_FICHE', NULL, NULL, 'Mise a jour de la fiche de renseignements', 'agent.deces', TIMESTAMP '2026-09-04 09:54:04.924701');
INSERT INTO O_23 VALUES(162, 1, 'EXPORT_FICHE_PDF', NULL, NULL, 'Export de la fiche PDF', 'system', TIMESTAMP '2026-09-04 10:21:33.079562');
INSERT INTO O_23 VALUES(163, 130, 'MODIFICATION_FICHE', NULL, NULL, 'Mise a jour de la fiche de renseignements', 'agent.deces', TIMESTAMP '2026-09-04 10:30:05.602184');
INSERT INTO O_23 VALUES(193, 227, 'CREATION_DOSSIER', NULL, 'EN_COURS', U&'Cr\00e9ation du dossier', 'system', TIMESTAMP '2026-09-04 10:48:47.358406');
INSERT INTO O_23 VALUES(194, 227, 'SOUMISSION_VALIDATION_INCOMPLETE', 'EN_COURS', 'INCOMPLET', 'Aucun ayant droit renseigne. | Piece obligatoire manquante : ACTE_DECES | Piece obligatoire manquante : CIN_ADHERENT | Piece obligatoire manquante : LIVRET_FAMILLE | Piece obligatoire manquante : RIB_BENEFICIAIRE', 'agent.deces', TIMESTAMP '2026-09-04 10:49:23.547113');
INSERT INTO O_23 VALUES(195, 227, 'SOUMISSION_VALIDATION_INCOMPLETE', 'INCOMPLET', 'INCOMPLET', 'Aucun ayant droit renseigne. | Piece obligatoire manquante : ACTE_DECES | Piece obligatoire manquante : CIN_ADHERENT | Piece obligatoire manquante : LIVRET_FAMILLE | Piece obligatoire manquante : RIB_BENEFICIAIRE', 'agent.deces', TIMESTAMP '2026-09-04 10:49:25.289881');
INSERT INTO O_23 VALUES(196, 227, 'SOUMISSION_VALIDATION_INCOMPLETE', 'INCOMPLET', 'INCOMPLET', 'Aucun ayant droit renseigne. | Piece obligatoire manquante : ACTE_DECES | Piece obligatoire manquante : CIN_ADHERENT | Piece obligatoire manquante : LIVRET_FAMILLE | Piece obligatoire manquante : RIB_BENEFICIAIRE', 'agent.deces', TIMESTAMP '2026-09-04 10:49:25.291881');
INSERT INTO O_23 VALUES(197, 227, 'SOUMISSION_VALIDATION', 'INCOMPLET', 'A_VALIDER', 'Dossier complet transmis pour validation', 'agent.deces', TIMESTAMP '2026-09-04 10:50:11.18661');
INSERT INTO O_23 VALUES(198, 227, 'VALIDATION_DOSSIER', 'A_VALIDER', 'VALIDE', U&'Validation depuis la page d\00e9tail', 'agent.deces', TIMESTAMP '2026-09-04 10:50:19.206497');
INSERT INTO O_23 VALUES(199, 228, 'CREATION_DOSSIER', NULL, 'EN_COURS', U&'Cr\00e9ation du dossier', 'system', TIMESTAMP '2026-09-04 10:55:47.298599');
INSERT INTO O_23 VALUES(200, 229, 'CREATION_DOSSIER', NULL, 'EN_COURS', U&'Cr\00e9ation du dossier', 'system', TIMESTAMP '2026-09-04 10:56:52.128544');
INSERT INTO O_23 VALUES(201, 230, 'CREATION_DOSSIER', NULL, 'EN_COURS', U&'Cr\00e9ation du dossier', 'system', TIMESTAMP '2026-09-04 11:01:38.327599');
INSERT INTO O_23 VALUES(202, 230, 'SOUMISSION_VALIDATION_INCOMPLETE', 'EN_COURS', 'INCOMPLET', 'Aucun ayant droit renseigne. | Piece obligatoire manquante : ACTE_DECES | Piece obligatoire manquante : CIN_ADHERENT | Piece obligatoire manquante : LIVRET_FAMILLE | Piece obligatoire manquante : RIB_BENEFICIAIRE', 'agent.deces', TIMESTAMP '2026-09-04 11:01:49.521324');
INSERT INTO O_23 VALUES(226, 1, 'ARCHIVAGE_DOSSIER', 'CLOTURE', 'ARCHIVE', U&'Dossier archiv\00e9', 'agent.deces', TIMESTAMP '2026-09-04 11:19:19.915439');
INSERT INTO O_23 VALUES(257, 259, 'CREATION_DOSSIER', NULL, 'EN_COURS', U&'Cr\00e9ation du dossier', 'system', TIMESTAMP '2026-09-09 11:05:20.465834');
INSERT INTO O_23 VALUES(258, 259, 'SOUMISSION_VALIDATION', 'EN_COURS', 'A_VALIDER', 'Dossier complet transmis pour validation', 'manager', TIMESTAMP '2026-09-09 11:07:14.148572');
INSERT INTO O_23 VALUES(259, 259, 'VALIDATION_DOSSIER', 'A_VALIDER', 'VALIDE', U&'Validation depuis la page d\00e9tail', 'manager', TIMESTAMP '2026-09-09 11:07:16.285797');
INSERT INTO O_23 VALUES(260, 259, 'CLOTURE_DOSSIER', 'VALIDE', 'CLOTURE', U&'Dossier cl\00f4tur\00e9', 'manager', TIMESTAMP '2026-09-09 11:07:29.212231');
CREATE TABLE O_27(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR);
INSERT INTO O_27 VALUES(1, 1, TIMESTAMP '2026-09-01 10:17:34.296476', 'BO-2026-001', 'MUTUELLE', TIMESTAMP '2026-09-01 10:17:34.296476', 'Clinique Centrale', 1, 'Demande urgente de prise en charge', TRUE);
INSERT INTO O_27 VALUES(2, 2, TIMESTAMP '2026-09-01 10:17:34.298476', 'BO-2026-002', 'ASSISTANCE_SOCIALE', TIMESTAMP '2026-09-01 10:17:34.298476', 'Service Social', 3, 'Transmission dossier assistance sociale', FALSE);
CREATE TABLE O_131(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR);
INSERT INTO O_131 VALUES(71, 'diag1', '20', '2zg', 1);
INSERT INTO O_131 VALUES(72, '', '', '', 1);
CREATE TABLE O_135(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR);
INSERT INTO O_135 VALUES(1, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-08 08:37:43.619534', U&'Cr\00e9ation du dossier RET-2026-1788853063517', 1);
INSERT INTO O_135 VALUES(33, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-08 10:50:24.076196', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(34, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-08 10:50:33.004241', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(65, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:20.225363', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(66, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:21.084437', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(67, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:21.27489', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(68, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:25.341783', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(69, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:25.804968', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(70, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:25.979235', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(71, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:38.326372', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(72, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:38.54032', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(73, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:00:38.744482', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(74, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:06.243685', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(75, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:06.459882', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(76, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:07.213518', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(77, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:07.668679', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(78, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:08.446026', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(79, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:08.764436', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(80, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:08.97152', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(81, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:14.495292', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(82, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:38.878616', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(83, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:39.933446', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(84, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:01:54.565689', U&'Informations administratives et sociales mises \00e0 jour', 1);
INSERT INTO O_135 VALUES(85, U&'Dossier valid\00e9 et cl\00f4tur\00e9', TIMESTAMP '2026-09-09 10:01:54.622249', U&'Le dossier n\2019est plus modifiable', 1);
INSERT INTO O_135 VALUES(86, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:02:06.430027', U&'Cr\00e9ation du dossier RET-2026-1788944526391', 33);
INSERT INTO O_135 VALUES(87, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:05:46.155258', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(88, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:06:48.671695', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(89, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:07:23.038934', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(90, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:07:40.832003', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(91, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:07:52.127555', U&'Cr\00e9ation du dossier RET-2026-1788944872121', 34);
INSERT INTO O_135 VALUES(92, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:08:08.041134', U&'Cr\00e9ation du dossier RET-2026-1788944888032', 35);
INSERT INTO O_135 VALUES(93, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:09:23.375438', U&'Cr\00e9ation du dossier RET-2026-1788944963368', 36);
INSERT INTO O_135 VALUES(94, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:09:53.7676', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(95, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:10:15.199903', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(96, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:10:26.07857', U&'Cr\00e9ation du dossier RET-2026-1788945026071', 37);
INSERT INTO O_135 VALUES(97, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:12:14.150745', U&'Cr\00e9ation du dossier RET-2026-1788945134143', 38);
INSERT INTO O_135 VALUES(98, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:12:28.656103', U&'Cr\00e9ation du dossier RET-2026-1788945148649', 39);
INSERT INTO O_135 VALUES(99, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:12:41.98182', U&'Cr\00e9ation du dossier RET-2026-1788945161976', 40);
INSERT INTO O_135 VALUES(100, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:13:28.91757', U&'Cr\00e9ation du dossier RET-2026-1788945208911', 41);
INSERT INTO O_135 VALUES(101, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:13:41.848543', U&'Cr\00e9ation du dossier RET-2026-1788945221840', 42);
INSERT INTO O_135 VALUES(102, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:49:28.284706', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(103, U&'Dossier cr\00e9\00e9', TIMESTAMP '2026-09-09 10:54:53.228555', U&'Cr\00e9ation du dossier RET-2026-1788947693217', 43);
INSERT INTO O_135 VALUES(104, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:57:01.161972', U&'Informations administratives et sociales mises \00e0 jour', 43);
INSERT INTO O_135 VALUES(105, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:58:06.448477', U&'Informations administratives et sociales mises \00e0 jour', 33);
INSERT INTO O_135 VALUES(106, U&'Dossier mis \00e0 jour', TIMESTAMP '2026-09-09 10:58:10.75902', U&'Informations administratives et sociales mises \00e0 jour', 33);
CREATE TABLE O_31(C0 VARCHAR, C1 VARCHAR);
INSERT INTO O_31 VALUES(1, 6);
INSERT INTO O_31 VALUES(1, 1);
INSERT INTO O_31 VALUES(1, 4);
INSERT INTO O_31 VALUES(1, 7);
INSERT INTO O_31 VALUES(1, 5);
INSERT INTO O_31 VALUES(1, 2);
INSERT INTO O_31 VALUES(1, 3);
INSERT INTO O_31 VALUES(2, 6);
INSERT INTO O_31 VALUES(2, 1);
INSERT INTO O_31 VALUES(2, 4);
INSERT INTO O_31 VALUES(2, 7);
INSERT INTO O_31 VALUES(2, 5);
INSERT INTO O_31 VALUES(2, 2);
INSERT INTO O_31 VALUES(2, 3);
INSERT INTO O_31 VALUES(3, 3);
INSERT INTO O_31 VALUES(4, 6);
INSERT INTO O_31 VALUES(4, 2);
INSERT INTO O_31 VALUES(5, 1);
INSERT INTO O_31 VALUES(6, 7);
INSERT INTO O_31 VALUES(7, 5);
INSERT INTO O_31 VALUES(8, 4);
CREATE TABLE O_11(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR);
INSERT INTO O_11 VALUES(1, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.286477', 'Adherent Demonstration', 6, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.286477', 'NORMALE', 'CAS-MUT-001', 3, 'Dossier initial MUTUELLE');
INSERT INTO O_11 VALUES(2, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.287475', 'Adherent Demonstration', 1, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.287475', 'NORMALE', 'CAS-ASSI-001', 3, 'Dossier initial ASSISTANCE_SOCIALE');
INSERT INTO O_11 VALUES(3, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.288476', 'Adherent Demonstration', 4, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.288476', 'NORMALE', 'CAS-CUL-001', 3, 'Dossier initial CULTURE_LOISIRS');
INSERT INTO O_11 VALUES(4, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.290475', 'Adherent Demonstration', 7, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.290475', 'NORMALE', 'CAS-RET-001', 3, 'Dossier initial RETRAITES');
INSERT INTO O_11 VALUES(5, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.291476', 'Adherent Demonstration', 5, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.291476', 'NORMALE', 'CAS-DEC-001', 3, 'Dossier initial DECES');
INSERT INTO O_11 VALUES(6, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.292476', 'Adherent Demonstration', 2, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.292476', 'NORMALE', 'CAS-ASSU-001', 3, 'Dossier initial ASSURANCE_SOCIALE');
INSERT INTO O_11 VALUES(7, DATE '2026-09-15', TIMESTAMP '2026-09-01 10:17:34.293476', 'Adherent Demonstration', 3, 'Dossier demo pour initialiser le module.', TIMESTAMP '2026-09-01 10:17:34.293476', 'NORMALE', 'CAS-BO-001', 3, 'Dossier initial BUREAU_ORDRE');
CREATE TABLE O_3(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR);
INSERT INTO O_3 VALUES(1, 'oued fes', 'SOUS_OFFICIERS', NULL, 'cd627265', NULL, DATE '2000-02-15', NULL, '2 eme geogm', 'amine@gmail.com', 'Centre formation bensliman', 'M/G', 'oued fes fes', '78653', '96522', NULL, 'khaldi', FALSE, 'amine', 'EN_ACTIVITE', '0612457856', '065421365');
INSERT INTO O_3 VALUES(2, 'routier ibn battouta oued fes fes', U&'Retrait\00e9', NULL, 'CD627265', NULL, DATE '2003-07-15', NULL, 'marrakech', 'salah@gmail.com', 'benslimaan', 'M/G', 'fes', '78952/GR', '25632', NULL, 'ayadech', FALSE, 'salah', 'Actif', '0645126958', NULL);
INSERT INTO O_3 VALUES(34, 'qqqqqqqqqqqqqq', 'Militaire', NULL, 'VF1254', NULL, DATE '1998-01-02', NULL, 'AGADIR', 'KHAK@gmail.com', 'FRANCZ', 'adj/c', 'LAMASIA', '2554154', '1222', NULL, 'barada', TRUE, 'ayman', 'Actif', '06322', NULL);
INSERT INTO O_3 VALUES(35, 'Adresse test 1 Rabat', 'Militaire', NULL, 'CINDEC001', NULL, DATE '1984-03-12', NULL, 'Unite Nord', 'testdec001@social.local', 'Formation A', 'Sergent', 'Rabat', 'TESTDEC001', 'BRDEC001', NULL, 'El Amrani', FALSE, 'Yassine', 'Actif', '0611000001', '0522000001');
INSERT INTO O_3 VALUES(36, 'Adresse test 2 Casablanca', 'Civile', NULL, 'CINDEC002', NULL, DATE '1990-06-21', NULL, 'Unite Sud', 'testdec002@social.local', 'Formation B', 'Technicien', 'Casablanca', 'TESTDEC002', 'BRDEC002', NULL, 'Benali', FALSE, 'Meryem', 'Actif', '0611000002', '0522000002');
INSERT INTO O_3 VALUES(37, 'Adresse test 3 Fes', 'Militaire', NULL, 'CINDEC003', NULL, DATE '1978-11-05', NULL, 'Unite Centre', 'testdec003@social.local', 'Formation C', 'Adjudant', 'Fes', 'TESTDEC003', 'BRDEC003', NULL, 'Khaldi', TRUE, 'Omar', 'Actif', '0611000003', '0522000003');
INSERT INTO O_3 VALUES(38, 'Adresse test 4 Marrakech', 'Civile', NULL, 'CINDEC004', NULL, DATE '1988-01-18', NULL, 'Unite Est', 'testdec004@social.local', 'Formation D', 'Administrateur', 'Marrakech', 'TESTDEC004', 'BRDEC004', NULL, 'Mansouri', FALSE, 'Sara', 'Actif', '0611000004', '0522000004');
INSERT INTO O_3 VALUES(39, 'Adresse test 5 Tanger', 'SOUS_OFFICIERS', NULL, 'CB110110', NULL, DATE '2002-09-29', NULL, 'Unite Ouest', 'testdec005@social.local', 'Formation E', 'M/G', 'SEFROU', '78552', '0078900', NULL, 'YASSINE', FALSE, 'BOUTMIZGUIDA', 'EN_ACTIVITE', '0611000005', '0522000005');
INSERT INTO O_3 VALUES(40, 'Adresse test 6 Agadir', 'Civile', NULL, 'CINDEC006', NULL, DATE '1992-12-14', NULL, 'Unite Nord', 'testdec006@social.local', 'Formation A', 'Agent', 'Agadir', 'TESTDEC006', 'BRDEC006', NULL, 'Rachidi', FALSE, 'Imane', 'Actif', '0611000006', '0522000006');
INSERT INTO O_3 VALUES(41, 'Adresse test 7 Oujda', 'Militaire', NULL, 'CINDEC007', NULL, DATE '1981-04-30', NULL, 'Unite Sud', 'testdec007@social.local', 'Formation B', 'Major', 'Oujda', 'TESTDEC007', 'BRDEC007', NULL, 'Alaoui', FALSE, 'Hicham', 'Actif', '0611000007', '0522000007');
INSERT INTO O_3 VALUES(42, 'Adresse test 8 Meknes', 'Civile', NULL, 'CINDEC008', NULL, DATE '1986-07-24', NULL, 'Unite Centre', 'testdec008@social.local', 'Formation C', 'Ingenieur', 'Meknes', 'TESTDEC008', 'BRDEC008', NULL, 'Berrada', FALSE, 'Kawtar', 'Actif', '0611000008', '0522000008');
INSERT INTO O_3 VALUES(43, 'Adresse test 9 Kenitra', 'Militaire', NULL, 'CINDEC009', NULL, DATE '1983-02-27', NULL, 'Unite Est', 'testdec009@social.local', 'Formation D', 'Lieutenant', 'Kenitra', 'TESTDEC009', 'BRDEC009', NULL, 'Tazi', FALSE, 'Reda', 'Actif', '0611000009', '0522000009');
INSERT INTO O_3 VALUES(44, 'Adresse test 10 Tetouan', 'Civile', NULL, 'CINDEC010', NULL, DATE '1991-10-03', NULL, 'Unite Ouest', 'testdec010@social.local', 'Formation E', 'Cadre', 'Tetouan', 'TESTDEC010', 'BRDEC010', NULL, 'Ouazzani', FALSE, 'Salma', 'Actif', '0611000010', '0522000010');
INSERT INTO O_3 VALUES(67, 'RUE FES BLOC 3', 'SOUS_OFFICIERS', NULL, 'CB300200', NULL, DATE '1998-02-01', NULL, 'FES', 'EXEPMPLE@GMAIL.com', 'SALE', 'M/G', 'SEFROU', '78955', '0078995', NULL, 'bmd', FALSE, 'OUSSAMA', 'EN_ACTIVITE', '0600110020', NULL);
CREATE TABLE O_15(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR);
INSERT INTO O_15 VALUES(65, TIMESTAMP '2026-09-03 10:55:41.637919', NULL, 'aaa', 4, 'aaa', 1);
INSERT INTO O_15 VALUES(97, TIMESTAMP '2026-09-03 11:21:24.432635', TIMESTAMP '2026-09-03 11:22:02.944606', 'aaaaaa', 1, 'prise an charge', 163);
CREATE TABLE O_7(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR);
INSERT INTO O_7 VALUES(33, 1, 'ACTE_DECES', U&'Acte de d\00e9c\00e8s', TRUE);
INSERT INTO O_7 VALUES(34, 1, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', TRUE);
INSERT INTO O_7 VALUES(35, 1, 'LIVRET_FAMILLE', 'Livret de famille', FALSE);
INSERT INTO O_7 VALUES(65, 130, 'ACTE_DECES', U&'Acte de d\00e9c\00e8s', TRUE);
INSERT INTO O_7 VALUES(66, 130, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', TRUE);
INSERT INTO O_7 VALUES(67, 130, 'RIB_BENEFICIAIRE', U&'RIB du b\00e9n\00e9ficiaire', TRUE);
INSERT INTO O_7 VALUES(68, 130, 'LIVRET_FAMILLE', 'Livret de famille', TRUE);
INSERT INTO O_7 VALUES(69, 163, 'RIB_BENEFICIAIRE', U&'RIB du b\00e9n\00e9ficiaire', TRUE);
INSERT INTO O_7 VALUES(70, 163, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', TRUE);
INSERT INTO O_7 VALUES(71, 163, 'ACTE_DECES', U&'Acte de d\00e9c\00e8s', TRUE);
INSERT INTO O_7 VALUES(72, 163, 'LIVRET_FAMILLE', 'Livret de famille', TRUE);
INSERT INTO O_7 VALUES(97, 227, 'ACTE_DECES', U&'Acte de d\00e9c\00e8s', TRUE);
INSERT INTO O_7 VALUES(98, 227, 'RIB_BENEFICIAIRE', U&'RIB du b\00e9n\00e9ficiaire', TRUE);
INSERT INTO O_7 VALUES(99, 227, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', TRUE);
INSERT INTO O_7 VALUES(100, 227, 'LIVRET_FAMILLE', 'Livret de famille', TRUE);
INSERT INTO O_7 VALUES(101, 231, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', FALSE);
INSERT INTO O_7 VALUES(129, 259, 'ACTE_DECES', U&'Acte de d\00e9c\00e8s', TRUE);
INSERT INTO O_7 VALUES(130, 259, 'RIB_BENEFICIAIRE', U&'RIB du b\00e9n\00e9ficiaire', TRUE);
INSERT INTO O_7 VALUES(131, 259, 'CIN_ADHERENT', U&'Copie CIN de l\2019adh\00e9rent', TRUE);
INSERT INTO O_7 VALUES(132, 259, 'LIVRET_FAMILLE', 'Livret de famille', TRUE);
CREATE TABLE O_19(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR);
INSERT INTO O_19 VALUES(1, 'salah ayadech', TIMESTAMP '2026-09-08 08:37:43.538667', NULL, TIMESTAMP '2026-09-09 10:01:54.626249', '', NULL, '25632', 'RETRAITE', 'RET-2026-1788853063517', 8, 2);
INSERT INTO O_19 VALUES(33, 'amine khaldi', TIMESTAMP '2026-09-09 10:02:06.393629', NULL, TIMESTAMP '2026-09-09 10:02:06.393629', '', NULL, '96522', 'RETRAITE', 'RET-2026-1788944526391', 8, 3);
INSERT INTO O_19 VALUES(34, 'ayman barada', TIMESTAMP '2026-09-09 10:07:52.12156', NULL, TIMESTAMP '2026-09-09 10:07:52.12156', '', NULL, '1222', 'RETRAITE', 'RET-2026-1788944872121', 8, 3);
INSERT INTO O_19 VALUES(35, 'Yassine El Amrani', TIMESTAMP '2026-09-09 10:08:08.032139', NULL, TIMESTAMP '2026-09-09 10:08:08.032139', '', NULL, 'BRDEC001', 'RETRAITE', 'RET-2026-1788944888032', 8, 3);
INSERT INTO O_19 VALUES(36, 'Imane Rachidi', TIMESTAMP '2026-09-09 10:09:23.368439', NULL, TIMESTAMP '2026-09-09 10:09:23.368439', '', NULL, 'BRDEC006', 'RETRAITE', 'RET-2026-1788944963368', 8, 3);
INSERT INTO O_19 VALUES(37, 'Omar Khaldi', TIMESTAMP '2026-09-09 10:10:26.071564', NULL, TIMESTAMP '2026-09-09 10:10:26.071564', '', NULL, 'BRDEC003', 'RETRAITE', 'RET-2026-1788945026071', 8, 3);
INSERT INTO O_19 VALUES(38, 'Hicham Alaoui', TIMESTAMP '2026-09-09 10:12:14.143746', NULL, TIMESTAMP '2026-09-09 10:12:14.143746', '', NULL, 'BRDEC007', 'RETRAITE', 'RET-2026-1788945134143', 8, 3);
INSERT INTO O_19 VALUES(39, 'Nabil Ziani', TIMESTAMP '2026-09-09 10:12:28.649093', NULL, TIMESTAMP '2026-09-09 10:12:28.649093', '', NULL, 'BRDEC005', 'RETRAITE', 'RET-2026-1788945148649', 8, 3);
INSERT INTO O_19 VALUES(40, 'Salma Ouazzani', TIMESTAMP '2026-09-09 10:12:41.976608', NULL, TIMESTAMP '2026-09-09 10:12:41.976608', '', NULL, 'BRDEC010', 'RETRAITE', 'RET-2026-1788945161976', 8, 3);
INSERT INTO O_19 VALUES(41, 'Meryem Benali', TIMESTAMP '2026-09-09 10:13:28.911571', NULL, TIMESTAMP '2026-09-09 10:13:28.911571', '', NULL, 'BRDEC002', 'RETRAITE', 'RET-2026-1788945208911', 8, 3);
INSERT INTO O_19 VALUES(42, 'Sara Mansouri', TIMESTAMP '2026-09-09 10:13:41.840578', NULL, TIMESTAMP '2026-09-09 10:13:41.840578', '', NULL, 'BRDEC004', 'RETRAITE', 'RET-2026-1788945221840', 8, 3);
INSERT INTO O_19 VALUES(43, 'BOUTMIZGUIDA YASSINE', TIMESTAMP '2026-09-09 10:54:53.217204', NULL, TIMESTAMP '2026-09-09 10:57:01.162969', '', NULL, '0078900', 'RETRAITE', 'RET-2026-1788947693217', 8, 3);
CREATE TABLE O_127(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR);
INSERT INTO O_127 VALUES(141, U&'Cr\00e9dit logement', 0.00, 1);
INSERT INTO O_127 VALUES(142, U&'Eau / \00e9lectricit\00e9', 0.00, 1);
INSERT INTO O_127 VALUES(143, U&'Frais m\00e9dicaux', 0.00, 1);
INSERT INTO O_127 VALUES(144, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 1);
INSERT INTO O_127 VALUES(165, U&'Cr\00e9dit logement', 0.00, 34);
INSERT INTO O_127 VALUES(166, U&'Eau / \00e9lectricit\00e9', 0.00, 34);
INSERT INTO O_127 VALUES(167, U&'Frais m\00e9dicaux', 0.00, 34);
INSERT INTO O_127 VALUES(168, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 34);
INSERT INTO O_127 VALUES(169, U&'Cr\00e9dit logement', 0.00, 35);
INSERT INTO O_127 VALUES(170, U&'Eau / \00e9lectricit\00e9', 0.00, 35);
INSERT INTO O_127 VALUES(171, U&'Frais m\00e9dicaux', 0.00, 35);
INSERT INTO O_127 VALUES(172, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 35);
INSERT INTO O_127 VALUES(173, U&'Cr\00e9dit logement', 0.00, 36);
INSERT INTO O_127 VALUES(174, U&'Eau / \00e9lectricit\00e9', 0.00, 36);
INSERT INTO O_127 VALUES(175, U&'Frais m\00e9dicaux', 0.00, 36);
INSERT INTO O_127 VALUES(176, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 36);
INSERT INTO O_127 VALUES(185, U&'Cr\00e9dit logement', 0.00, 37);
INSERT INTO O_127 VALUES(186, U&'Eau / \00e9lectricit\00e9', 0.00, 37);
INSERT INTO O_127 VALUES(187, U&'Frais m\00e9dicaux', 0.00, 37);
INSERT INTO O_127 VALUES(188, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 37);
INSERT INTO O_127 VALUES(189, U&'Cr\00e9dit logement', 0.00, 38);
INSERT INTO O_127 VALUES(190, U&'Eau / \00e9lectricit\00e9', 0.00, 38);
INSERT INTO O_127 VALUES(191, U&'Frais m\00e9dicaux', 0.00, 38);
INSERT INTO O_127 VALUES(192, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 38);
INSERT INTO O_127 VALUES(193, U&'Cr\00e9dit logement', 0.00, 39);
INSERT INTO O_127 VALUES(194, U&'Eau / \00e9lectricit\00e9', 0.00, 39);
INSERT INTO O_127 VALUES(195, U&'Frais m\00e9dicaux', 0.00, 39);
INSERT INTO O_127 VALUES(196, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 39);
INSERT INTO O_127 VALUES(197, U&'Cr\00e9dit logement', 0.00, 40);
INSERT INTO O_127 VALUES(198, U&'Eau / \00e9lectricit\00e9', 0.00, 40);
INSERT INTO O_127 VALUES(199, U&'Frais m\00e9dicaux', 0.00, 40);
INSERT INTO O_127 VALUES(200, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 40);
INSERT INTO O_127 VALUES(201, U&'Cr\00e9dit logement', 0.00, 41);
INSERT INTO O_127 VALUES(202, U&'Eau / \00e9lectricit\00e9', 0.00, 41);
INSERT INTO O_127 VALUES(203, U&'Frais m\00e9dicaux', 0.00, 41);
INSERT INTO O_127 VALUES(204, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 41);
INSERT INTO O_127 VALUES(205, U&'Cr\00e9dit logement', 0.00, 42);
INSERT INTO O_127 VALUES(206, U&'Eau / \00e9lectricit\00e9', 0.00, 42);
INSERT INTO O_127 VALUES(207, U&'Frais m\00e9dicaux', 0.00, 42);
INSERT INTO O_127 VALUES(208, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 42);
INSERT INTO O_127 VALUES(217, U&'Cr\00e9dit logement', 0.00, 43);
INSERT INTO O_127 VALUES(218, U&'Eau / \00e9lectricit\00e9', 0.00, 43);
INSERT INTO O_127 VALUES(219, U&'Frais m\00e9dicaux', 0.00, 43);
INSERT INTO O_127 VALUES(220, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 43);
INSERT INTO O_127 VALUES(225, U&'Cr\00e9dit logement', 0.00, 33);
INSERT INTO O_127 VALUES(226, U&'Eau / \00e9lectricit\00e9', 0.00, 33);
INSERT INTO O_127 VALUES(227, U&'Frais m\00e9dicaux', 0.00, 33);
INSERT INTO O_127 VALUES(228, U&'Autres (loyer, cr\00e9dit, consommation)', 0.00, 33);
CREATE TABLE O_169(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR, C28 VARCHAR, C29 VARCHAR, C30 VARCHAR, C31 VARCHAR, C32 VARCHAR, C33 VARCHAR, C34 VARCHAR, C35 VARCHAR, C36 VARCHAR, C37 VARCHAR, C38 VARCHAR, C39 VARCHAR, C40 VARCHAR, C41 VARCHAR, C42 VARCHAR, C43 VARCHAR, C44 VARCHAR, C45 VARCHAR, C46 VARCHAR, C47 VARCHAR, C48 VARCHAR, C49 VARCHAR, C50 VARCHAR, C51 VARCHAR, C52 VARCHAR, C53 VARCHAR, C54 VARCHAR, C55 VARCHAR, C56 VARCHAR, C57 VARCHAR, C58 VARCHAR, C59 VARCHAR, C60 VARCHAR, C61 VARCHAR, C62 VARCHAR);
INSERT INTO O_169 VALUES(1, 2, 'routier ibn battouta oued fes fes', 'marrakech', 'CD627265', TIMESTAMP '2026-09-08 08:37:43.570471', NULL, TIMESTAMP '2026-09-09 10:01:54.626249', DATE '2003-07-15', NULL, 'M/G', '', '', FALSE, '25632', '', 'ayadech', 'salah', FALSE, 'Actif', 2, 'sqsqa', '0645126958', 1, 'q', '', FALSE, '', '', U&'Retrait\00e9', '', 'q', '', NULL, NULL, '', '', 'salah@gmail.com', 'benslimaan', '', 'fes', '78952/GR', '', '', '', '', '', '', 'ayadech', '', '', '', '', '', '', '', FALSE, 'salah', '', '', 'Actif', '', '');
INSERT INTO O_169 VALUES(33, 1, 'oued fes', '2 eme geogm', 'cd627265', TIMESTAMP '2026-09-09 10:02:06.394628', NULL, TIMESTAMP '2026-09-09 10:10:15.2009', DATE '2000-02-15', NULL, 'M/G', '', '', FALSE, '96522', '', 'khaldi', 'amine', FALSE, U&'Divorc\00e9(e)', 3, 'ss', '0612457856', 33, '', '', FALSE, '', '', 'SOUS_OFFICIERS', '', '', '', NULL, NULL, '', '', 'amine@gmail.com', 'Centre formation bensliman', '', 'oued fes fes', '78653', '', '', '', '', 'aa', '', 'khaldi', '', '', '', '', '', '', '', FALSE, 'amine', '', '', 'EN_ACTIVITE', '', '065421365');
INSERT INTO O_169 VALUES(34, 34, 'qqqqqqqqqqqqqq', 'AGADIR', 'VF1254', TIMESTAMP '2026-09-09 10:07:52.12156', NULL, TIMESTAMP '2026-09-09 10:07:52.12156', DATE '1998-01-02', NULL, 'adj/c', '', '', FALSE, '1222', '', 'barada', 'ayman', FALSE, '', 3, '', '06322', 34, '', '', FALSE, '', '', 'Militaire', '', '', '', NULL, NULL, '', '', 'KHAK@gmail.com', 'FRANCZ', '', 'LAMASIA', '2554154', '', '', '', '', '', '', 'barada', '', '', '', '', '', '', '', TRUE, 'ayman', '', '', 'Actif', '', '');
INSERT INTO O_169 VALUES(35, 35, 'Adresse test 1 Rabat', 'Unite Nord', 'CINDEC001', TIMESTAMP '2026-09-09 10:08:08.033135', NULL, TIMESTAMP '2026-09-09 10:08:08.033135', DATE '1984-03-12', NULL, 'Sergent', '', '', FALSE, 'BRDEC001', '', 'El Amrani', 'Yassine', FALSE, '', 3, '', '0611000001', 35, '', '', FALSE, '', '', 'Militaire', '', '', '', NULL, NULL, '', '', 'testdec001@social.local', 'Formation A', '', 'Rabat', 'TESTDEC001', '', '', '', '', '', '', 'El Amrani', '', '', '', '', '', '', '', FALSE, 'Yassine', '', '', 'Actif', '', '0522000001');
INSERT INTO O_169 VALUES(36, 40, 'Adresse test 6 Agadir', 'Unite Nord', 'CINDEC006', TIMESTAMP '2026-09-09 10:09:23.369441', NULL, TIMESTAMP '2026-09-09 10:09:23.369441', DATE '1992-12-14', NULL, 'Agent', '', '', FALSE, 'BRDEC006', '', 'Rachidi', 'Imane', FALSE, '', 3, '', '0611000006', 36, '', '', FALSE, '', '', 'Civile', '', '', '', NULL, NULL, '', '', 'testdec006@social.local', 'Formation A', '', 'Agadir', 'TESTDEC006', '', '', '', '', '', '', 'Rachidi', '', '', '', '', '', '', '', FALSE, 'Imane', '', '', 'Actif', '', '0522000006');
INSERT INTO O_169 VALUES(37, 37, 'Adresse test 3 Fes', 'Unite Centre', 'CINDEC003', TIMESTAMP '2026-09-09 10:10:26.072595', NULL, TIMESTAMP '2026-09-09 10:10:26.072595', DATE '1978-11-05', NULL, 'Adjudant', '', '', FALSE, 'BRDEC003', '', 'Khaldi', 'Omar', FALSE, '', 3, '', '0611000003', 37, '', '', FALSE, '', '', 'Militaire', '', '', '', NULL, NULL, '', '', 'testdec003@social.local', 'Formation C', '', 'Fes', 'TESTDEC003', '', '', '', '', '', '', 'Khaldi', '', '', '', '', '', '', '', TRUE, 'Omar', '', '', 'Actif', '', '0522000003');
INSERT INTO O_169 VALUES(38, 41, 'Adresse test 7 Oujda', 'Unite Sud', 'CINDEC007', TIMESTAMP '2026-09-09 10:12:14.143746', NULL, TIMESTAMP '2026-09-09 10:12:14.143746', DATE '1981-04-30', NULL, 'Major', '', '', FALSE, 'BRDEC007', '', 'Alaoui', 'Hicham', FALSE, '', 3, '', '0611000007', 38, '', '', FALSE, '', '', 'Militaire', '', '', '', NULL, NULL, '', '', 'testdec007@social.local', 'Formation B', '', 'Oujda', 'TESTDEC007', '', '', '', '', '', '', 'Alaoui', '', '', '', '', '', '', '', FALSE, 'Hicham', '', '', 'Actif', '', '0522000007');
INSERT INTO O_169 VALUES(39, 39, 'Adresse test 5 Tanger', 'Unite Ouest', 'CINDEC005', TIMESTAMP '2026-09-09 10:12:28.650126', NULL, TIMESTAMP '2026-09-09 10:12:28.650126', DATE '1975-09-09', NULL, 'Capitaine', '', '', FALSE, 'BRDEC005', '', 'Ziani', 'Nabil', FALSE, '', 3, '', '0611000005', 39, '', '', FALSE, '', '', 'Militaire', '', '', '', NULL, NULL, '', '', 'testdec005@social.local', 'Formation E', '', 'Tanger', 'TESTDEC005', '', '', '', '', '', '', 'Ziani', '', '', '', '', '', '', '', TRUE, 'Nabil', '', '', 'Actif', '', '0522000005');
INSERT INTO O_169 VALUES(40, 44, 'Adresse test 10 Tetouan', 'Unite Ouest', 'CINDEC010', TIMESTAMP '2026-09-09 10:12:41.976608', NULL, TIMESTAMP '2026-09-09 10:12:41.976608', DATE '1991-10-03', NULL, 'Cadre', '', '', FALSE, 'BRDEC010', '', 'Ouazzani', 'Salma', FALSE, '', 3, '', '0611000010', 40, '', '', FALSE, '', '', 'Civile', '', '', '', NULL, NULL, '', '', 'testdec010@social.local', 'Formation E', '', 'Tetouan', 'TESTDEC010', '', '', '', '', '', '', 'Ouazzani', '', '', '', '', '', '', '', FALSE, 'Salma', '', '', 'Actif', '', '0522000010');
INSERT INTO O_169 VALUES(41, 36, 'Adresse test 2 Casablanca', 'Unite Sud', 'CINDEC002', TIMESTAMP '2026-09-09 10:13:28.911571', NULL, TIMESTAMP '2026-09-09 10:13:28.911571', DATE '1990-06-21', NULL, 'Technicien', '', '', FALSE, 'BRDEC002', '', 'Benali', 'Meryem', FALSE, '', 3, '', '0611000002', 41, '', '', FALSE, '', '', 'Civile', '', '', '', NULL, NULL, '', '', 'testdec002@social.local', 'Formation B', '', 'Casablanca', 'TESTDEC002', '', '', '', '', '', '', 'Benali', '', '', '', '', '', '', '', FALSE, 'Meryem', '', '', 'Actif', '', '0522000002');
INSERT INTO O_169 VALUES(42, 38, 'Adresse test 4 Marrakech', 'Unite Est', 'CINDEC004', TIMESTAMP '2026-09-09 10:13:41.841546', NULL, TIMESTAMP '2026-09-09 10:13:41.841546', DATE '1988-01-18', NULL, 'Administrateur', '', '', FALSE, 'BRDEC004', '', 'Mansouri', 'Sara', FALSE, '', 3, '', '0611000004', 42, '', '', FALSE, '', '', 'Civile', '', '', '', NULL, NULL, '', '', 'testdec004@social.local', 'Formation D', '', 'Marrakech', 'TESTDEC004', '', '', '', '', '', '', 'Mansouri', '', '', '', '', '', '', '', FALSE, 'Sara', '', '', 'Actif', '', '0522000004');
INSERT INTO O_169 VALUES(43, 39, 'Adresse test 5 Tanger', 'Unite Ouest', 'CB110110', TIMESTAMP '2026-09-09 10:54:53.219236', NULL, TIMESTAMP '2026-09-09 10:57:01.162969', DATE '2002-09-29', NULL, 'M/G', '', '', FALSE, '0078900', '', 'YASSINE', 'BOUTMIZGUIDA', FALSE, '', 3, '', '0611000005', 43, '', '', FALSE, '', '', 'SOUS_OFFICIERS', '', '', '', NULL, NULL, '', '', 'testdec005@social.local', 'Formation E', '', 'SEFROU', '78552', '', '', '', '', '', '', 'YASSINE', '', '', '', '', '', '', '', FALSE, 'BOUTMIZGUIDA', '', '', 'EN_ACTIVITE', '', '0522000005');
---- Schema ----
CREATE USER IF NOT EXISTS "SA" SALT 'b4d4d8f247d0d773' HASH '144087affd33f667760fbb9141b9f9348bba3d8baa7a5aef78d58f7adf6c226c' ADMIN;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_E30D9947_AEC6_41ED_B5F7_A069F4544794" START WITH 1 RESTART WITH 68 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2C7C24F3_E89C_4BF4_AB93_CC910CD4D769" START WITH 1 RESTART WITH 233 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_8AF75D28_4B9D_4906_AFBF_8C3AA23CEF09" START WITH 1 RESTART WITH 133 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_E877A252_4E74_4BD1_A75D_CEB9EDBD413C" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_62970041_A418_404C_807C_AAEE2C61BB58" START WITH 1 RESTART WITH 129 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_6B9921F9_DE36_4705_A510_CE6005019242" START WITH 1 RESTART WITH 44 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_4013BC53_5EC9_4CAE_B1AC_77963344786E" START WITH 1 RESTART WITH 260 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_878E1D82_D5F6_4031_99BD_97224B1638B6" START WITH 1 RESTART WITH 261 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_308012E9_C620_48C0_860B_8CF53E141566" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_014EF0A5_6DC4_4FA7_92C4_FED72C95E709" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_CF0BFA41_2B80_44EF_A0C6_38DD8EB5C879" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_DF30F4A2_B3C3_4DEA_9A35_D117B1692FB8" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_A97783E9_89D4_4936_9CD2_696A81D290D9" START WITH 1 RESTART WITH 44 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FDD82D6F_DBB0_43EA_8C1A_4820F464A1F6" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_136EBDD9_94A3_4B16_9A8C_A327C399626C" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_14D7D9E5_D8E6_4342_8380_4631D09EFD82" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2A340B9C_7B4C_4BBE_AB13_067BAA430407" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_D48AF4C4_FAB3_4F12_8DCB_C0602CEDE4F5" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2A7135E8_A1D1_48CE_8902_ECE50084571D" START WITH 1 RESTART WITH 188 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_971FF61E_9309_452E_B995_51FDAD7AA5EF" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_91396A10_4DAE_4F30_B2F1_D45FF2D28798" START WITH 1 RESTART WITH 229 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_15B758C2_17ED_4D20_A1F9_CB654B26D08B" START WITH 1 RESTART WITH 73 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_319F425B_8FAE_4F6D_B043_441E5A535B17" START WITH 1 RESTART WITH 107 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_321B2812_5834_4A1B_B2CC_4C6799BFC926" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_1697C2F1_A9FF_430C_ADE4_AA1FA5CCC496" START WITH 1 RESTART WITH 188 BELONGS_TO_TABLE;
CREATE CACHED TABLE "PUBLIC"."ADHERENTS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_E30D9947_AEC6_41ED_B5F7_A069F4544794" NOT NULL,
    "ADRESSE" CHARACTER VARYING(255) NOT NULL,
    "CATEGORIE" CHARACTER VARYING(80) NOT NULL,
    "CAUSE_DECES" CHARACTER VARYING(255),
    "CIN" CHARACTER VARYING(30) NOT NULL,
    "DATE_DECES" DATE,
    "DATE_NAISSANCE" DATE NOT NULL,
    "DATE_RADIATION" DATE,
    "DERNIER_UNITE" CHARACTER VARYING(120) NOT NULL,
    "EMAIL" CHARACTER VARYING(254) NOT NULL,
    "FORMATION_UNITE" CHARACTER VARYING(120) NOT NULL,
    "GRADE" CHARACTER VARYING(80) NOT NULL,
    "LIEU_NAISSANCE" CHARACTER VARYING(100) NOT NULL,
    "MATRICULE" CHARACTER VARYING(50) NOT NULL,
    "MATRICULEBR" CHARACTER VARYING(50) NOT NULL,
    "MOTIF_RADIATION" CHARACTER VARYING(255),
    "NOM_AR" CHARACTER VARYING(100) NOT NULL,
    "PENSION" BOOLEAN NOT NULL,
    "PRENOM_AR" CHARACTER VARYING(100) NOT NULL,
    "SITUATION_CATEGORIE" CHARACTER VARYING(80) NOT NULL,
    "TELEPHONE1" CHARACTER VARYING(30) NOT NULL,
    "TELEPHONE2" CHARACTER VARYING(30)
);
CREATE CACHED TABLE "PUBLIC"."PIECES_JUSTIFICATIVES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_8AF75D28_4B9D_4906_AFBF_8C3AA23CEF09" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "TYPE_PIECE" CHARACTER VARYING(60) NOT NULL,
    "LIBELLE" CHARACTER VARYING(160) NOT NULL,
    "PRESENT" BOOLEAN NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."AYANT_DROIT"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2C7C24F3_E89C_4BF4_AB93_CC910CD4D769" NOT NULL,
    "ADRESSE" CHARACTER VARYING(255),
    "CIN" CHARACTER VARYING(30) NOT NULL,
    "DATE_NAISSANCE" DATE,
    "LIEN_PARENTE" CHARACTER VARYING(50) NOT NULL,
    "NOM" CHARACTER VARYING(100) NOT NULL,
    "POURCENTAGE" FLOAT(53),
    "PRENOM" CHARACTER VARYING(100) NOT NULL,
    "TELEPHONE" CHARACTER VARYING(30),
    "TYPE_REPARTITION" ENUM('CHARIA', 'POURCENTAGE') NOT NULL,
    "ADHERENT_ID" BIGINT NOT NULL,
    "LIEU_NAISSANCE" CHARACTER VARYING(100),
    "SITUATION_FAMILIALE" CHARACTER VARYING(100),
    "NIVEAU_INSTRUCTION" CHARACTER VARYING(120),
    "ACTIVITE_EMPLOI" CHARACTER VARYING(160)
);
CREATE CACHED TABLE "PUBLIC"."CASE_RECORDS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_E877A252_4E74_4BD1_A75D_CEB9EDBD413C" NOT NULL,
    "DUE_DATE" DATE,
    "LAST_UPDATED" TIMESTAMP(6) NOT NULL,
    "MEMBER_NAME" CHARACTER VARYING(255) NOT NULL,
    "MODULE" ENUM('ASSISTANCE_SOCIALE', 'ASSURANCE_SOCIALE', 'BUREAU_ORDRE', 'CULTURE_LOISIRS', 'DECES', 'MUTUELLE', 'RETRAITES') NOT NULL,
    "NOTES" CHARACTER VARYING(2000),
    "OPENED_AT" TIMESTAMP(6) NOT NULL,
    "PRIORITY" CHARACTER VARYING(255),
    "REFERENCE_CODE" CHARACTER VARYING(255) NOT NULL,
    "STATUS" ENUM('ARCHIVED', 'COMPLETED', 'IN_PROGRESS', 'OPEN', 'PENDING') NOT NULL,
    "TITLE" CHARACTER VARYING(255) NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."DEMANDE_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_62970041_A418_404C_807C_AAEE2C61BB58" NOT NULL,
    "DATE_DEMANDE" TIMESTAMP(6) NOT NULL,
    "DATE_TRAITEMENT" TIMESTAMP(6),
    "DESCRIPTION" CHARACTER VARYING(1000),
    "STATUT" ENUM('ACCEPTEE', 'CLOTUREE', 'EN_ATTENTE', 'EN_COURS', 'REFUSEE') NOT NULL,
    "TYPE_DEMANDE" CHARACTER VARYING(100) NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."DOSSIERS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_6B9921F9_DE36_4705_A510_CE6005019242" NOT NULL,
    "ADHERENT_NOM" CHARACTER VARYING(150) NOT NULL,
    "DATE_CREATION" TIMESTAMP(6) NOT NULL,
    "DATE_EVENEMENT" DATE,
    "DATE_MAJ" TIMESTAMP(6),
    "DESCRIPTION" CHARACTER VARYING(1000),
    "LIEU" CHARACTER VARYING(120),
    "MATRICULE" CHARACTER VARYING(50) NOT NULL,
    "NATURE" CHARACTER VARYING(120),
    "NUMERO" CHARACTER VARYING(40) NOT NULL,
    "SECTION" ENUM('ADHERENTS', 'ASSISTANCE', 'ASSURANCE', 'BUREAU_ORDRE', 'CULTURE', 'DECES', 'MUTUELLE', 'RETRAITES', 'SUPER_ADMIN') NOT NULL,
    "STATUT" ENUM('A_VALIDER', 'CLOTURE', 'EN_COURS', 'INCOMPLET', 'VALIDE') NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."DOSSIER_DECES_HISTORIQUE"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_878E1D82_D5F6_4031_99BD_97224B1638B6" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "ACTION" CHARACTER VARYING(80) NOT NULL,
    "ANCIEN_STATUT" CHARACTER VARYING(30),
    "NOUVEAU_STATUT" CHARACTER VARYING(30),
    "COMMENTAIRE" CHARACTER VARYING(2000),
    "USERNAME" CHARACTER VARYING(120),
    "DATE_ACTION" TIMESTAMP NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."MAIL_RECORDS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_308012E9_C620_48C0_860B_8CF53E141566" NOT NULL,
    "DIRECTION" ENUM('INCOMING', 'OUTGOING') NOT NULL,
    "LAST_MOVEMENT_AT" TIMESTAMP(6) NOT NULL,
    "MAIL_NUMBER" CHARACTER VARYING(255) NOT NULL,
    "RECEIVER_SECTION" CHARACTER VARYING(255) NOT NULL,
    "REGISTERED_AT" TIMESTAMP(6) NOT NULL,
    "SENDER_NAME" CHARACTER VARYING(255),
    "STATUS" ENUM('ASSIGNED', 'CLOSED', 'IN_PROGRESS', 'REGISTERED') NOT NULL,
    "SUBJECT" CHARACTER VARYING(255) NOT NULL,
    "URGENT" BOOLEAN NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."USER_ALLOWED_MODULES"(
    "USER_ID" BIGINT NOT NULL,
    "MODULE" ENUM('ASSISTANCE_SOCIALE', 'ASSURANCE_SOCIALE', 'BUREAU_ORDRE', 'CULTURE_LOISIRS', 'DECES', 'MUTUELLE', 'RETRAITES') NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."USER_PROFILES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_014EF0A5_6DC4_4FA7_92C4_FED72C95E709" NOT NULL,
    "ACTIVE" BOOLEAN NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "EMAIL" CHARACTER VARYING(255) NOT NULL,
    "FULL_NAME" CHARACTER VARYING(255) NOT NULL,
    "PASSWORD_HASH" CHARACTER VARYING(255) NOT NULL,
    "ROLE" ENUM('ADMIN', 'AGENT', 'MANAGER') NOT NULL,
    "USERNAME" CHARACTER VARYING(255) NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."LIQUIDATIONS_DROITS_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_CF0BFA41_2B80_44EF_A0C6_38DD8EB5C879" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "DESIGNATION" CHARACTER VARYING(60) NOT NULL,
    "MONTANT" DECIMAL(19, 2) NOT NULL,
    "BENEFICIAIRE" CHARACTER VARYING(160),
    "REFERENCE" CHARACTER VARYING(120)
);
CREATE CACHED TABLE "PUBLIC"."ASSURANCE_RECORDS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_DF30F4A2_B3C3_4DEA_9A35_D117B1692FB8" NOT NULL,
    "ADHERENT_ID" BIGINT NOT NULL,
    "CAUSE_DECES" CHARACTER VARYING(500),
    "CIN" CHARACTER VARYING(30),
    "CODE_MALADIE" CHARACTER VARYING(100),
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "DATE_COMMISSION" DATE,
    "DATE_DECES" DATE,
    "DECES_MONTANT" NUMERIC(15, 2),
    "DESIGNATION" CHARACTER VARYING(255),
    "GRADE" CHARACTER VARYING(80),
    "IMPUTABLE" BOOLEAN,
    "MALADIE" CHARACTER VARYING(500),
    "MATRICULE" CHARACTER VARYING(50),
    "MATRICULEBR" CHARACTER VARYING(50),
    "NOM_COMPLET" CHARACTER VARYING(160) NOT NULL,
    "NUMERO" CHARACTER VARYING(40) NOT NULL,
    "PECULE_MONTANT" NUMERIC(15, 2),
    "REFERENCE_ENVOI" CHARACTER VARYING(120),
    "TAUX_INVALIDITE" NUMERIC(5, 2),
    "TYPE" ENUM('DECES', 'INVALIDITE') NOT NULL,
    "UNITE_ACTUELLE" CHARACTER VARYING(140)
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_MEMBRES_FAMILLE"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_321B2812_5834_4A1B_B2CC_4C6799BFC926" NOT NULL,
    "ACTIVITE" CHARACTER VARYING(120),
    "CIN" CHARACTER VARYING(50),
    "DATE_NAISSANCE" DATE,
    "EMPLOI" CHARACTER VARYING(120),
    "NIVEAU_INSTRUCTION" CHARACTER VARYING(120),
    "NOM" CHARACTER VARYING(100) NOT NULL,
    "PERSONNEACHARGE" BOOLEAN NOT NULL,
    "PRENOM" CHARACTER VARYING(100) NOT NULL,
    "TYPE" CHARACTER VARYING(30) NOT NULL,
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL,
    "DIVORCE" DATE,
    "LIEN" CHARACTER VARYING(255),
    "LIEU" CHARACTER VARYING(255),
    "LIEU_TRAVAIL" CHARACTER VARYING(255),
    "MARIAGE" DATE,
    "MUTUELLE" CHARACTER VARYING(255),
    "SITUATION_FAMILIALE" CHARACTER VARYING(255)
);
CREATE CACHED TABLE "PUBLIC"."PENSIONS_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FDD82D6F_DBB0_43EA_8C1A_4820F464A1F6" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "AYANT_DROIT_ID" BIGINT,
    "TYPE_BENEFICIAIRE" CHARACTER VARYING(30) NOT NULL,
    "NUMERO" CHARACTER VARYING(100),
    "MONTANT" DECIMAL(19, 2) NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."MUTUELLE_DOSSIERS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_14D7D9E5_D8E6_4342_8380_4631D09EFD82" NOT NULL,
    "ADHERENT_ID" BIGINT NOT NULL,
    "CENTRE_SOIN" CHARACTER VARYING(120),
    "CIN" CHARACTER VARYING(30),
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "DATE_ENVOI" DATE,
    "DATE_RECEPTION" DATE,
    "DESIGNATION" CHARACTER VARYING(500),
    "GRADE" CHARACTER VARYING(80),
    "MATRICULE" CHARACTER VARYING(50),
    "MATRICULEBR" CHARACTER VARYING(50),
    "NOM_COMPLET" CHARACTER VARYING(160) NOT NULL,
    "NUMERO_DOSSIER" CHARACTER VARYING(40) NOT NULL,
    "NUMERO_ENVOI" CHARACTER VARYING(40),
    "NUMERO_ORDRE" CHARACTER VARYING(40) NOT NULL,
    "OBSERVATION" CHARACTER VARYING(500),
    "TYPE_COURRIER" ENUM('EXTERNE', 'INTERNE') NOT NULL,
    "TYPE_DOSSIER" ENUM('ALD', 'DENTAIRE', 'NORMAL') NOT NULL,
    "UNITE_ACTUELLE" CHARACTER VARYING(140)
);
CREATE CACHED TABLE "PUBLIC"."ASSURANCES_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_136EBDD9_94A3_4B16_9A8C_A327C399626C" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "AYANT_DROIT_ID" BIGINT,
    "TYPE_BENEFICIAIRE" CHARACTER VARYING(30) NOT NULL,
    "NUMERO_CHEQUE" CHARACTER VARYING(100),
    "MONTANT" DECIMAL(19, 2) NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."SITUATIONS_FINANCIERES_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2A340B9C_7B4C_4BBE_AB13_067BAA430407" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "PMR" DECIMAL(19, 2),
    "PMI" DECIMAL(19, 2),
    "SALAIRE" DECIMAL(19, 2),
    "AUTRES_RESSOURCES" DECIMAL(19, 2),
    "EAU_ELECTRICITE" DECIMAL(19, 2),
    "FRAIS_MEDICAUX" DECIMAL(19, 2),
    "FRAIS_SCOLARITE" DECIMAL(19, 2),
    "LOYER" DECIMAL(19, 2),
    "AUTRES_CHARGES" DECIMAL(19, 2)
);
CREATE CACHED TABLE "PUBLIC"."ASSISTANCES_OCTROYEES_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_D48AF4C4_FAB3_4F12_8DCB_C0602CEDE4F5" NOT NULL,
    "DOSSIER_ID" BIGINT NOT NULL,
    "DESIGNATION" CHARACTER VARYING(40) NOT NULL,
    "MONTANT" DECIMAL(19, 2) NOT NULL,
    "DATE" DATE,
    "CHEQUE_REFERENCE" CHARACTER VARYING(120)
);
CREATE CACHED TABLE "PUBLIC"."DOSSIERS_DECES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_4013BC53_5EC9_4CAE_B1AC_77963344786E" NOT NULL,
    "ADHERENT_ID" BIGINT NOT NULL,
    "CAUSE_DECES" CHARACTER VARYING(255),
    "DATE_DECES" DATE NOT NULL,
    "DPR" CHARACTER VARYING(100),
    "LIEU_DECES" CHARACTER VARYING(150) NOT NULL,
    "NATURE_DECES" CHARACTER VARYING(50),
    "NOM_COMPLET" CHARACTER VARYING(150) NOT NULL,
    "NUMERO" CHARACTER VARYING(30) NOT NULL,
    "OBSERVATION" CHARACTER VARYING(2000),
    "STATUT" CHARACTER VARYING(30) NOT NULL,
    "DATE_CREATION" TIMESTAMP,
    "DATE_MAJ" TIMESTAMP,
    "DATE_VALIDATION" TIMESTAMP,
    "DATE_CLOTURE" TIMESTAMP,
    "VALIDE_PAR" CHARACTER VARYING(120),
    "CLOTURE_PAR" CHARACTER VARYING(120),
    "MOTIF_DERNIERE_DECISION" CHARACTER VARYING(2000),
    "DATE_SOUMISSION_VALIDATION" TIMESTAMP,
    "DATE_RETOUR_COMPLEMENT" TIMESTAMP,
    "SOUMIS_PAR" CHARACTER VARYING(120),
    "RETOURNE_PAR" CHARACTER VARYING(120)
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_AFFILIATIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_2A7135E8_A1D1_48CE_8902_ECE50084571D" NOT NULL,
    "NUMERO_CARTE" CHARACTER VARYING(80),
    "OBSERVATION" CHARACTER VARYING(500),
    "TITULAIRE" BOOLEAN NOT NULL,
    "TYPE_CARTE" CHARACTER VARYING(50) NOT NULL,
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_ASSISTANCES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_971FF61E_9309_452E_B995_51FDAD7AA5EF" NOT NULL,
    "DATE_ASSISTANCE" DATE,
    "NATURE" CHARACTER VARYING(255),
    "OBSERVATION" CHARACTER VARYING(1000),
    "ORGANISME" CHARACTER VARYING(255),
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_CHARGES_MENSUELLES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_91396A10_4DAE_4F30_B2F1_D45FF2D28798" NOT NULL,
    "DESIGNATION" CHARACTER VARYING(120) NOT NULL,
    "MONTANT" NUMERIC(12, 2),
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_DONNEES_MEDICO_SOCIALES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_15B758C2_17ED_4D20_A1F9_CB654B26D08B" NOT NULL,
    "DIAGNOSTIC" CHARACTER VARYING(1000),
    "DUREE" CHARACTER VARYING(100),
    "IDENTIFICATION" CHARACTER VARYING(255),
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_HISTORIQUES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_319F425B_8FAE_4F6D_B043_441E5A535B17" NOT NULL,
    "ACTION" CHARACTER VARYING(255) NOT NULL,
    "DATE_ACTION" TIMESTAMP(6) NOT NULL,
    "DETAIL" CHARACTER VARYING(1000),
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_PIECES"(
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL,
    "CONTENU" CHARACTER LARGE OBJECT,
    "MIME" CHARACTER VARYING(255),
    "NOM" CHARACTER VARYING(255),
    "QUANTITE" INTEGER,
    "TYPE" CHARACTER VARYING(255)
);
CREATE CACHED TABLE "PUBLIC"."RETRAITE_RESSOURCES_MENSUELLES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_1697C2F1_A9FF_430C_ADE4_AA1FA5CCC496" NOT NULL,
    "DESIGNATION" CHARACTER VARYING(100) NOT NULL,
    "MONTANT" NUMERIC(12, 2),
    "DOSSIER_RETRAITE_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE "PUBLIC"."DOSSIERS_RETRAITES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_A97783E9_89D4_4936_9CD2_696A81D290D9" NOT NULL,
    "ADHERENT_ID" BIGINT,
    "ADRESSE" CHARACTER VARYING(500),
    "AFFECTATION" CHARACTER VARYING(150),
    "CIN" CHARACTER VARYING(50),
    "DATE_CREATION" TIMESTAMP(6) NOT NULL,
    "DATE_ENQUETE" DATE,
    "DATE_MAJ" TIMESTAMP(6),
    "DATE_NAISSANCE" DATE,
    "DATE_RADIATION" DATE,
    "GRADE" CHARACTER VARYING(80),
    "HABITATION" CHARACTER VARYING(120),
    "HABITATION_PRECISION" CHARACTER VARYING(500),
    "LOCATAIRE" BOOLEAN NOT NULL,
    "MATRICULE_BR" CHARACTER VARYING(50),
    "MOTIF" CHARACTER VARYING(255),
    "NOM" CHARACTER VARYING(100) NOT NULL,
    "PRENOM" CHARACTER VARYING(100) NOT NULL,
    "PROPRIETAIRE" BOOLEAN NOT NULL,
    "SITUATION_FAMILIALE" CHARACTER VARYING(80),
    "STATUT" ENUM('A_VALIDER', 'CLOTURE', 'EN_COURS', 'INCOMPLET', 'VALIDE') NOT NULL,
    "TELEPHONE_FIXE" CHARACTER VARYING(50),
    "TELEPHONE_GSM" CHARACTER VARYING(50),
    "DOSSIER_ID" BIGINT NOT NULL,
    "ADRESSEEM" CHARACTER VARYING(255),
    "ANNEE_ADHESION" CHARACTER VARYING(255),
    "AVEC_PHOTO" BOOLEAN,
    "CARTE_FONDATION" CHARACTER VARYING(255),
    "CARTE_PRELEVEMENT_CMR" CHARACTER VARYING(255),
    "CATEGORIE" CHARACTER VARYING(255),
    "CAUSE_DECES" CHARACTER VARYING(255),
    "CODE" CHARACTER VARYING(255),
    "COLIS_RAMADAN" CHARACTER VARYING(255),
    "DATE_DECES" DATE,
    "DATE_ENTREE_SERVICE" DATE,
    "DATE_PAIEMENT" CHARACTER VARYING(255),
    "DERNIERE_REGION" CHARACTER VARYING(255),
    "EMAIL" CHARACTER VARYING(255),
    "FORMATION_UNITE" CHARACTER VARYING(255),
    "HAY_RABAT" CHARACTER VARYING(255),
    "LIEU_NAISSANCE" CHARACTER VARYING(255),
    "MATRICULE_CORPS" CHARACTER VARYING(255),
    "MODE_REGLEMENT" CHARACTER VARYING(255),
    "MONTANT_PMI" CHARACTER VARYING(255),
    "MONTANT_PMR" CHARACTER VARYING(255),
    "MOTIF_ENQUETE" CHARACTER VARYING(255),
    "MOTIF_RADIATION_SANCTION" CHARACTER VARYING(255),
    "NATURE_DECES" CHARACTER VARYING(255),
    "NOM_AR" CHARACTER VARYING(255),
    "NUMERO_DOSSIER" CHARACTER VARYING(255),
    "NUMERO_PMI" CHARACTER VARYING(255),
    "NUMERO_PMR" CHARACTER VARYING(255),
    "NUMERO_RECU" CHARACTER VARYING(255),
    "OBSERVATION" CHARACTER VARYING(255),
    "OBSERVATION_ADHESION" CHARACTER VARYING(255),
    "OBSERVATION_SOCIALE" CHARACTER VARYING(255),
    "PENSION" BOOLEAN,
    "PRENOM_AR" CHARACTER VARYING(255),
    "PROFESSION_ACTUELLE" CHARACTER VARYING(255),
    "REGION_RESIDENCE" CHARACTER VARYING(255),
    "SITUATION_CATEGORIE" CHARACTER VARYING(255),
    "SITUATION_FRATERNELLE" CHARACTER VARYING(255),
    "TELEPHONE_GSM2" CHARACTER VARYING(255)
);
INSERT INTO "PUBLIC"."ADHERENTS" SELECT * FROM O_3;
INSERT INTO "PUBLIC"."RETRAITE_DONNEES_MEDICO_SOCIALES" SELECT * FROM O_131;
INSERT INTO "PUBLIC"."PIECES_JUSTIFICATIVES" SELECT * FROM O_7;
INSERT INTO "PUBLIC"."RETRAITE_HISTORIQUES" SELECT * FROM O_135;
INSERT INTO "PUBLIC"."AYANT_DROIT" SELECT * FROM O_10;
INSERT INTO "PUBLIC"."CASE_RECORDS" SELECT * FROM O_11;
INSERT INTO "PUBLIC"."PENSIONS_DECES" SELECT * FROM O_78;
INSERT INTO "PUBLIC"."DEMANDE_DECES" SELECT * FROM O_15;
INSERT INTO "PUBLIC"."RETRAITE_RESSOURCES_MENSUELLES" SELECT * FROM O_143;
INSERT INTO "PUBLIC"."DOSSIERS" SELECT * FROM O_19;
INSERT INTO "PUBLIC"."ASSURANCES_DECES" SELECT * FROM O_86;
INSERT INTO "PUBLIC"."DOSSIER_DECES_HISTORIQUE" SELECT * FROM O_23;
INSERT INTO "PUBLIC"."MAIL_RECORDS" SELECT * FROM O_27;
INSERT INTO "PUBLIC"."SITUATIONS_FINANCIERES_DECES" SELECT * FROM O_94;
INSERT INTO "PUBLIC"."USER_ALLOWED_MODULES" SELECT * FROM O_31;
INSERT INTO "PUBLIC"."USER_PROFILES" SELECT * FROM O_34;
INSERT INTO "PUBLIC"."ASSISTANCES_OCTROYEES_DECES" SELECT * FROM O_101;
INSERT INTO "PUBLIC"."LIQUIDATIONS_DROITS_DECES" SELECT * FROM O_39;
INSERT INTO "PUBLIC"."DOSSIERS_RETRAITES" SELECT * FROM O_169;
INSERT INTO "PUBLIC"."DOSSIERS_DECES" SELECT * FROM O_107;
INSERT INTO "PUBLIC"."RETRAITE_AFFILIATIONS" SELECT * FROM O_119;
INSERT INTO "PUBLIC"."RETRAITE_CHARGES_MENSUELLES" SELECT * FROM O_127;
DROP TABLE O_34;
DROP TABLE O_131;
DROP TABLE O_3;
DROP TABLE O_101;
DROP TABLE O_39;
DROP TABLE O_135;
DROP TABLE O_7;
DROP TABLE O_169;
DROP TABLE O_10;
DROP TABLE O_107;
DROP TABLE O_11;
DROP TABLE O_78;
DROP TABLE O_143;
DROP TABLE O_15;
DROP TABLE O_19;
DROP TABLE O_86;
DROP TABLE O_119;
DROP TABLE O_23;
DROP TABLE O_27;
DROP TABLE O_94;
DROP TABLE O_31;
DROP TABLE O_127;
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKSXYEPT663B3657RQW8TYB2T7J_INDEX_9" ON "PUBLIC"."ADHERENTS"("MATRICULE" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK5AM8GM84MD8Q1BD92AJ8YIL3Y_INDEX_F" ON "PUBLIC"."CASE_RECORDS"("REFERENCE_CODE" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKFHY1HHYX8SYRYO9G7SGCSNHSX_INDEX_7" ON "PUBLIC"."DOSSIERS"("NUMERO" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKOI38TOL2MH0QFJDFAX3O2CKPV_INDEX_9" ON "PUBLIC"."ADHERENTS"("CIN" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK8HB7LKT7SCXITQ1Y38RD923YG_INDEX_C" ON "PUBLIC"."MAIL_RECORDS"("MAIL_NUMBER" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKDQLTQKAW58M11JBOV0UDX8XQG_INDEX_9" ON "PUBLIC"."USER_PROFILES"("EMAIL" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK5VLT12TABPCCUCKQ0E84NHS4C_INDEX_9" ON "PUBLIC"."USER_PROFILES"("USERNAME" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKL13HYLUX4WVX2TPC5PU1956A1_INDEX_E" ON "PUBLIC"."DEMANDE_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK9PRP4FKX5BV4VKRCL8YWWDBXD_INDEX_F" ON "PUBLIC"."USER_ALLOWED_MODULES"("USER_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK_PIECE_DOSSIER_TYPE_INDEX_A" ON "PUBLIC"."PIECES_JUSTIFICATIVES"("DOSSIER_ID" NULLS FIRST, "TYPE_PIECE" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_AYANT_DROIT_ADHERENT_INDEX_8" ON "PUBLIC"."AYANT_DROIT"("ADHERENT_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_PIECE_DOSSIER_INDEX_A" ON "PUBLIC"."PIECES_JUSTIFICATIVES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_LIQUIDATION_DOSSIER_INDEX_1" ON "PUBLIC"."LIQUIDATIONS_DROITS_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_PENSION_DOSSIER_INDEX_5" ON "PUBLIC"."PENSIONS_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_PENSION_AYANT_INDEX_5" ON "PUBLIC"."PENSIONS_DECES"("AYANT_DROIT_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_ASSURANCE_DOSSIER_INDEX_2" ON "PUBLIC"."ASSURANCES_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_ASSURANCE_AYANT_INDEX_2" ON "PUBLIC"."ASSURANCES_DECES"("AYANT_DROIT_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."CONSTRAINT_INDEX_1" ON "PUBLIC"."SITUATIONS_FINANCIERES_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK_ASSISTANCE_DOSSIER_INDEX_B" ON "PUBLIC"."ASSISTANCES_OCTROYEES_DECES"("DOSSIER_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKFVRHHAX0DUDC091CPOCQQ2Q5G_INDEX_4" ON "PUBLIC"."DOSSIERS_DECES"("NUMERO" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKSSTFJOLJ340BXXFGNDXNQK6NI_INDEX_A" ON "PUBLIC"."RETRAITE_PIECES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKDAK8VA2QWYA0D4HKM2UG33GAM_INDEX_5" ON "PUBLIC"."ASSURANCE_RECORDS"("NUMERO" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKH012OG7929FUHO53D5QNWU5BS_INDEX_6" ON "PUBLIC"."RETRAITE_MEMBRES_FAMILLE"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKT9Y0N22P3LILVM09SAX0OM614_INDEX_C" ON "PUBLIC"."MUTUELLE_DOSSIERS"("NUMERO_DOSSIER" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK23JIGLXYV5PTBKXCG242OLXBM_INDEX_B" ON "PUBLIC"."RETRAITE_AFFILIATIONS"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKAMAXRYF052QD3QNRGTDV2DB48_INDEX_8" ON "PUBLIC"."RETRAITE_ASSISTANCES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKL2UCJHFKBV35214AHF5CHX056_INDEX_B" ON "PUBLIC"."RETRAITE_CHARGES_MENSUELLES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKS2VE4KFB3GVNEF0E81PNFUOQB_INDEX_2" ON "PUBLIC"."RETRAITE_DONNEES_MEDICO_SOCIALES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKHRB69Q03C9EY9B5R4U16NKP3T_INDEX_B" ON "PUBLIC"."RETRAITE_HISTORIQUES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKNW8A1GRUBGTYVWEYOTETH8AUT_INDEX_E" ON "PUBLIC"."RETRAITE_RESSOURCES_MENSUELLES"("DOSSIER_RETRAITE_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKQYXEQC7VURNBYGBNYK756CYX5_INDEX_2" ON "PUBLIC"."DOSSIERS_RETRAITES"("DOSSIER_ID" NULLS FIRST);
ALTER TABLE "PUBLIC"."ADHERENTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_9" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_9";
ALTER TABLE "PUBLIC"."CASE_RECORDS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_F" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_F";
ALTER TABLE "PUBLIC"."DEMANDE_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_E" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_E";
ALTER TABLE "PUBLIC"."DOSSIERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_7" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_7";
ALTER TABLE "PUBLIC"."MAIL_RECORDS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C3" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C3";
ALTER TABLE "PUBLIC"."USER_ALLOWED_MODULES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_FF" PRIMARY KEY("USER_ID", "MODULE") INDEX "PUBLIC"."PRIMARY_KEY_FF";
ALTER TABLE "PUBLIC"."USER_PROFILES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_99" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_99";
ALTER TABLE "PUBLIC"."DOSSIER_DECES_HISTORIQUE" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C";
ALTER TABLE "PUBLIC"."ADHERENTS" ADD CONSTRAINT "PUBLIC"."UKSXYEPT663B3657RQW8TYB2T7J" UNIQUE NULLS DISTINCT ("MATRICULE") INDEX "PUBLIC"."UKSXYEPT663B3657RQW8TYB2T7J_INDEX_9";
ALTER TABLE "PUBLIC"."CASE_RECORDS" ADD CONSTRAINT "PUBLIC"."UK5AM8GM84MD8Q1BD92AJ8YIL3Y" UNIQUE NULLS DISTINCT ("REFERENCE_CODE") INDEX "PUBLIC"."UK5AM8GM84MD8Q1BD92AJ8YIL3Y_INDEX_F";
ALTER TABLE "PUBLIC"."DOSSIERS" ADD CONSTRAINT "PUBLIC"."UKFHY1HHYX8SYRYO9G7SGCSNHSX" UNIQUE NULLS DISTINCT ("NUMERO") INDEX "PUBLIC"."UKFHY1HHYX8SYRYO9G7SGCSNHSX_INDEX_7";
ALTER TABLE "PUBLIC"."ADHERENTS" ADD CONSTRAINT "PUBLIC"."UKOI38TOL2MH0QFJDFAX3O2CKPV" UNIQUE NULLS DISTINCT ("CIN") INDEX "PUBLIC"."UKOI38TOL2MH0QFJDFAX3O2CKPV_INDEX_9";
ALTER TABLE "PUBLIC"."MAIL_RECORDS" ADD CONSTRAINT "PUBLIC"."UK8HB7LKT7SCXITQ1Y38RD923YG" UNIQUE NULLS DISTINCT ("MAIL_NUMBER") INDEX "PUBLIC"."UK8HB7LKT7SCXITQ1Y38RD923YG_INDEX_C";
ALTER TABLE "PUBLIC"."USER_PROFILES" ADD CONSTRAINT "PUBLIC"."UKDQLTQKAW58M11JBOV0UDX8XQG" UNIQUE NULLS DISTINCT ("EMAIL") INDEX "PUBLIC"."UKDQLTQKAW58M11JBOV0UDX8XQG_INDEX_9";
ALTER TABLE "PUBLIC"."USER_PROFILES" ADD CONSTRAINT "PUBLIC"."UK5VLT12TABPCCUCKQ0E84NHS4C" UNIQUE NULLS DISTINCT ("USERNAME") INDEX "PUBLIC"."UK5VLT12TABPCCUCKQ0E84NHS4C_INDEX_9";
ALTER TABLE "PUBLIC"."AYANT_DROIT" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_92" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_8A";
ALTER TABLE "PUBLIC"."PIECES_JUSTIFICATIVES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_A" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_A";
ALTER TABLE "PUBLIC"."PIECES_JUSTIFICATIVES" ADD CONSTRAINT "PUBLIC"."UK_PIECE_DOSSIER_TYPE" UNIQUE NULLS DISTINCT ("DOSSIER_ID", "TYPE_PIECE") INDEX "PUBLIC"."UK_PIECE_DOSSIER_TYPE_INDEX_A";
ALTER TABLE "PUBLIC"."ASSURANCE_RECORDS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_53" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_53";
ALTER TABLE "PUBLIC"."LIQUIDATIONS_DROITS_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_19" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_1";
ALTER TABLE "PUBLIC"."RETRAITE_MEMBRES_FAMILLE" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_3" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_6";
ALTER TABLE "PUBLIC"."PENSIONS_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_5" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_5";
ALTER TABLE "PUBLIC"."ASSURANCES_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_2" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_2";
ALTER TABLE "PUBLIC"."SITUATIONS_FINANCIERES_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_14" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_14";
ALTER TABLE "PUBLIC"."SITUATIONS_FINANCIERES_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_14C" UNIQUE NULLS DISTINCT ("DOSSIER_ID") INDEX "PUBLIC"."CONSTRAINT_INDEX_1";
ALTER TABLE "PUBLIC"."ASSISTANCES_OCTROYEES_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_B" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_B";
ALTER TABLE "PUBLIC"."MUTUELLE_DOSSIERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C37" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C37";
ALTER TABLE "PUBLIC"."DOSSIERS_DECES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_1" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_4";
ALTER TABLE "PUBLIC"."DOSSIERS_DECES" ADD CONSTRAINT "PUBLIC"."UKFVRHHAX0DUDC091CPOCQQ2Q5G" UNIQUE NULLS DISTINCT ("NUMERO") INDEX "PUBLIC"."UKFVRHHAX0DUDC091CPOCQQ2Q5G_INDEX_4";
ALTER TABLE "PUBLIC"."RETRAITE_AFFILIATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_B5" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_B5";
ALTER TABLE "PUBLIC"."RETRAITE_ASSISTANCES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_8" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_8";
ALTER TABLE "PUBLIC"."RETRAITE_CHARGES_MENSUELLES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_B9" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_B9";
ALTER TABLE "PUBLIC"."RETRAITE_DONNEES_MEDICO_SOCIALES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_29" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_29";
ALTER TABLE "PUBLIC"."RETRAITE_HISTORIQUES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_B2" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_B2";
ALTER TABLE "PUBLIC"."SITUATIONS_FINANCIERES_DECES" ADD CONSTRAINT "PUBLIC"."UKQJ2AMSQ193B2JB36FU3HPDD6Y" UNIQUE NULLS DISTINCT ("DOSSIER_ID");
ALTER TABLE "PUBLIC"."RETRAITE_RESSOURCES_MENSUELLES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_EB" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_EB";
ALTER TABLE "PUBLIC"."ASSURANCE_RECORDS" ADD CONSTRAINT "PUBLIC"."UKDAK8VA2QWYA0D4HKM2UG33GAM" UNIQUE NULLS DISTINCT ("NUMERO") INDEX "PUBLIC"."UKDAK8VA2QWYA0D4HKM2UG33GAM_INDEX_5";
ALTER TABLE "PUBLIC"."MUTUELLE_DOSSIERS" ADD CONSTRAINT "PUBLIC"."UKT9Y0N22P3LILVM09SAX0OM614" UNIQUE NULLS DISTINCT ("NUMERO_DOSSIER") INDEX "PUBLIC"."UKT9Y0N22P3LILVM09SAX0OM614_INDEX_C";
ALTER TABLE "PUBLIC"."DOSSIERS_RETRAITES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_D" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_2C1";
ALTER TABLE "PUBLIC"."DOSSIERS_RETRAITES" ADD CONSTRAINT "PUBLIC"."UKQYXEQC7VURNBYGBNYK756CYX5" UNIQUE NULLS DISTINCT ("DOSSIER_ID") INDEX "PUBLIC"."UKQYXEQC7VURNBYGBNYK756CYX5_INDEX_2";
ALTER TABLE "PUBLIC"."USER_ALLOWED_MODULES" ADD CONSTRAINT "PUBLIC"."FK9PRP4FKX5BV4VKRCL8YWWDBXD" FOREIGN KEY("USER_ID") INDEX "PUBLIC"."FK9PRP4FKX5BV4VKRCL8YWWDBXD_INDEX_F" REFERENCES "PUBLIC"."USER_PROFILES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."AYANT_DROIT" ADD CONSTRAINT "PUBLIC"."FK_AYANT_DROIT_ADHERENT" FOREIGN KEY("ADHERENT_ID") INDEX "PUBLIC"."FK_AYANT_DROIT_ADHERENT_INDEX_8" REFERENCES "PUBLIC"."ADHERENTS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."PENSIONS_DECES" ADD CONSTRAINT "PUBLIC"."FK_PENSION_AYANT" FOREIGN KEY("AYANT_DROIT_ID") INDEX "PUBLIC"."FK_PENSION_AYANT_INDEX_5" REFERENCES "PUBLIC"."AYANT_DROIT"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."ASSURANCES_DECES" ADD CONSTRAINT "PUBLIC"."FK_ASSURANCE_AYANT" FOREIGN KEY("AYANT_DROIT_ID") INDEX "PUBLIC"."FK_ASSURANCE_AYANT_INDEX_2" REFERENCES "PUBLIC"."AYANT_DROIT"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."DEMANDE_DECES" ADD CONSTRAINT "PUBLIC"."FKL13HYLUX4WVX2TPC5PU1956A1" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FKL13HYLUX4WVX2TPC5PU1956A1_INDEX_E" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."PIECES_JUSTIFICATIVES" ADD CONSTRAINT "PUBLIC"."FK_PIECE_DOSSIER" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FK_PIECE_DOSSIER_INDEX_A" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."LIQUIDATIONS_DROITS_DECES" ADD CONSTRAINT "PUBLIC"."FK_LIQUIDATION_DOSSIER" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FK_LIQUIDATION_DOSSIER_INDEX_1" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."PENSIONS_DECES" ADD CONSTRAINT "PUBLIC"."FK_PENSION_DOSSIER" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FK_PENSION_DOSSIER_INDEX_5" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."ASSURANCES_DECES" ADD CONSTRAINT "PUBLIC"."FK_ASSURANCE_DOSSIER" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FK_ASSURANCE_DOSSIER_INDEX_2" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."SITUATIONS_FINANCIERES_DECES" ADD CONSTRAINT "PUBLIC"."FK_SITUATION_DOSSIER" FOREIGN KEY("DOSSIER_ID") REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."ASSISTANCES_OCTROYEES_DECES" ADD CONSTRAINT "PUBLIC"."FK_ASSISTANCE_DOSSIER" FOREIGN KEY("DOSSIER_ID") INDEX "PUBLIC"."FK_ASSISTANCE_DOSSIER_INDEX_B" REFERENCES "PUBLIC"."DOSSIERS_DECES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_MEMBRES_FAMILLE" ADD CONSTRAINT "PUBLIC"."FKH012OG7929FUHO53D5QNWU5BS" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKH012OG7929FUHO53D5QNWU5BS_INDEX_6" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_PIECES" ADD CONSTRAINT "PUBLIC"."FKSSTFJOLJ340BXXFGNDXNQK6NI" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKSSTFJOLJ340BXXFGNDXNQK6NI_INDEX_A" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."DOSSIERS_RETRAITES" ADD CONSTRAINT "PUBLIC"."FKSSWHS3WVNANTW883NOJH74GNF" FOREIGN KEY("DOSSIER_ID") REFERENCES "PUBLIC"."DOSSIERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_AFFILIATIONS" ADD CONSTRAINT "PUBLIC"."FK23JIGLXYV5PTBKXCG242OLXBM" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FK23JIGLXYV5PTBKXCG242OLXBM_INDEX_B" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_ASSISTANCES" ADD CONSTRAINT "PUBLIC"."FKAMAXRYF052QD3QNRGTDV2DB48" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKAMAXRYF052QD3QNRGTDV2DB48_INDEX_8" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_CHARGES_MENSUELLES" ADD CONSTRAINT "PUBLIC"."FKL2UCJHFKBV35214AHF5CHX056" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKL2UCJHFKBV35214AHF5CHX056_INDEX_B" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_DONNEES_MEDICO_SOCIALES" ADD CONSTRAINT "PUBLIC"."FKS2VE4KFB3GVNEF0E81PNFUOQB" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKS2VE4KFB3GVNEF0E81PNFUOQB_INDEX_2" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_HISTORIQUES" ADD CONSTRAINT "PUBLIC"."FKHRB69Q03C9EY9B5R4U16NKP3T" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKHRB69Q03C9EY9B5R4U16NKP3T_INDEX_B" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RETRAITE_RESSOURCES_MENSUELLES" ADD CONSTRAINT "PUBLIC"."FKNW8A1GRUBGTYVWEYOTETH8AUT" FOREIGN KEY("DOSSIER_RETRAITE_ID") INDEX "PUBLIC"."FKNW8A1GRUBGTYVWEYOTETH8AUT_INDEX_E" REFERENCES "PUBLIC"."DOSSIERS_RETRAITES"("ID") NOCHECK;
DROP ALIAS READ_BLOB_MAP;
DROP ALIAS READ_CLOB_MAP;
DROP TABLE IF EXISTS INFORMATION_SCHEMA.LOB_BLOCKS;
