'use strict';

// CIP Vol1 Table C-6.1
const DataType = {
  BOOL: 0xC1,
  SINT: 0xC2,
  INT: 0xC3,
  DINT: 0xC4,
  LINT: 0xC5,
  USINT: 0xC6,
  UINT: 0xC7,
  UDINT: 0xC8,
  ULINT: 0xC9,
  REAL: 0xCA,
  LREAL: 0xCB,
  STIME: 0xCC,
  DATE: 0xCD,
  TIME_OF_DAY: 0xCE,
  DATE_AND_TIME: 0xCF,
  STRING: 0xD0,
  BYTE: 0xD1,
  WORD: 0xD2,
  DWORD: 0xD3,
  LWORD: 0xD4,
  STRING2: 0xD5,
  FTIME: 0xD6,
  LTIME: 0xD7,
  ITIME: 0xD8,
  STRINGN: 0xD9,
  SHORT_STRING: 0xDA,
  TIME: 0xDB,
  EPATH: 0xDC,
  ENGUNIT: 0xDD,
  STRINGI: 0xDE
};

// CIP Vol1 Table C-6.1
const DateTypeInfo = {
  0xC1: { name: 'BOOL', description: 'Logical boolean with values TRUE and FALSE' },
  0xC2: { name: 'SINT', description: 'Signed 8-bit integer value' },
  0xC3: { name: 'INT', description: 'Signed 16–bit integer value' },
  0xC4: { name: 'DINT', description: 'Signed 32–bit integer value' },
  0xC5: { name: 'LINT', description: 'Signed 64–bit integer value' },
  0xC6: { name: 'USINT', description: 'Unsigned 8–bit integer value' },
  0xC7: { name: 'UINT', description: 'Unsigned 16–bit integer value' },
  0xC8: { name: 'UDINT', description: 'Unsigned 32–bit integer value' },
  0xC9: { name: 'ULINT', description: 'Unsigned 64–bit integer value' },
  0xCA: { name: 'REAL', description: '32–bit floating point value' },
  0xCB: { name: 'LREAL', description: '64–bit floating point value' },
  0xCC: { name: 'STIME', description: 'Synchronous time information' },
  0xCD: { name: 'DATE', description: 'Date information' },
  0xCE: { name: 'TIME_OF_DAY', description: 'Time of day' },
  0xCF: { name: 'DATE_AND_TIME', description: 'Date and time of day' },
  0xD0: { name: 'STRING', description: 'Character string (1 byte per character)' },
  0xD1: { name: 'BYTE', description: 'Bit string - 8-bits' },
  0xD2: { name: 'WORD', description: 'Bit string - 16-bits' },
  0xD3: { name: 'DWORD', description: 'Bit string - 32-bits' },
  0xD4: { name: 'LWORD', description: 'Bit string - 64-bits' },
  0xD5: { name: 'STRING2', description: 'Character string (2 bytes per character)' },
  0xD6: { name: 'FTIME', description: 'Duration (high resolution)' },
  0xD7: { name: 'LTIME', description: 'Duration (long)' },
  0xD8: { name: 'ITIME', description: 'Duration (short)' },
  0xD9: { name: 'STRINGN', description: 'Character string (N bytes per character)' },
  0xDA: { name: 'SHORT_STRING', description: 'Character sting (1 byte per character, 1 byte length indicator)' },
  0xDB: { name: 'TIME', description: 'Duration (milliseconds)' },
  0xDC: { name: 'EPATH', description: 'CIP path segments' },
  0xDD: { name: 'ENGUNIT', description: 'Engineering Units' },
  0xDE: { name: 'STRINGI', description: 'International Character String' },
};

module.exports = {
  DataType,
  DataTypeInfo
};