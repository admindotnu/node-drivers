'use strict';

// EIP-CIP-V1 Table 5.1
const Classes = {
  Identity: 0x01,
  MessageRouter: 0x02,
  DeviceNet: 0x03,
  Assembly: 0x04,
  Connection: 0x05,
  ConnectionManager: 0x06,
  Register: 0x07,
  DiscreteInputPoint: 0x08,
  DiscreteOutputPoint: 0x09,
  AnalogInputPoint: 0x0A,
  AnalogOuputPoint: 0x0B,
  PresenceSensing: 0x0E,
  Parameter: 0x0F,
  ParameterGroup: 0x10,
  Group: 0x12,
  DiscreteInputGroup: 0x1D,
  DiscreteOutputGroup: 0x1E,
  DiscreteGroup: 0x1F,
  AnalogInputGroup: 0x20,
  AnalogOutputGroup: 0x21,
  AnalogGroup: 0x22,
  PositionSensor: 0x23,
  PositionControllerSupervisor: 0x24,
  PositionController: 0x25,
  BlockSequencer: 0x26,
  CommandBlock: 0x27,
  MotorData: 0x28,
  ControlSupervisor: 0x29,
  ACDCDrive: 0x2A,
  AcknowledgeHandler: 0x2B,
  Overload: 0x2C,
  Softstart: 0x2D,
  Selection: 0x2E,
  SDeviceSupervisor: 0x30,
  SAnalogSensor: 0x31,
  SAnalogActuator: 0x32,
  SSingleStageController: 0x33,
  SGasCalibration: 0x34,
  TripPoint: 0x35,
  File: 0x37,
  SPartialPressure: 0x38,
  SafetySupervisor: 0x39,
  SafetyValidator: 0x3A,
  SafetyDiscreteOutputPoint: 0x3B,
  SafetyDiscreteOutputGroup: 0x3C,
  SafetyDiscreteInputPoint: 0x3D,
  SafetyDiscreteInputGroup: 0x3E,
  SafetyDualChannelOutput: 0x3F,
  SSensorCalibration: 0x40,
  EventLog: 0x41,
  MotionAxis: 0x42,
  TimeSync: 0x43,
  Modbus: 0x44,
  PCCC: 0x67,
  SCANportPassThroughParameter: 0x93,
  SCANportPassThroughFaultQueue: 0x97,
  SCANportPassThroughWarningQueue: 0x98,
  SCANportPassThroughLink: 0x99,
  NonVolatileStorage: 0xA1,
  ControlNet: 0xF0,
  ControlNetKeeper: 0xF1,
  ControlNetScheduling: 0xF2,
  ConnectionConfiguration: 0xF3,
  Port: 0xF4,
  TCPIPInterface: 0xF5,
  EthernetLink: 0xF6,
  CompoNetLink: 0xF7,
  CompoNetRepeater: 0xF8
};

const ClassNames = {};
Object.entries(Classes).forEach(([key, value]) => {
  ClassNames[value] = key;
});

// CIP Vol1 Appendix A
const Services = {
  GetAttributesAll: 0x01,
  SetAttributesAll: 0x02,
  GetAttributeList: 0x03,
  SetAttributeList: 0x04,
  Reset: 0x05,
  Start: 0x06,
  Stop: 0x07,
  Create: 0x08,
  Delete: 0x09,
  MultipleServicePacket: 0x0A,
  ApplyAttributes: 0x0D,
  GetAttributeSingle: 0x0E,
  SetAttributeSingle: 0x10,
  FindNextObjectInstance: 0x11,
  Restore: 0x15,
  Save: 0x16,
  NoOperation: 0x17,
  GetMember: 0x18,
  SetMember: 0x19,
  InsertMember: 0x1A,
  RemoveMember: 0x1B,
  GroupSync: 0x1C
};

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

const DataTypeName = {};
Object.entries(DataType).forEach(([key, value]) => {
  DataTypeName[value] = key;
});

// CIP Vol1 Table 4-4.2
const ReservedClassAttributes = {
  Revision: 1,
  MaxInstance: 2,
  NumberOfInstances: 3,
  OptionalAttributeList: 4,
  OptionalServiceList: 5,
  MaximumIDNumberClassAttributes: 6,
  MaximumIDNumberInstanceAttributes: 7
};

module.exports = {
  Classes,
  ClassNames,
  Services,
  DataType,
  DataTypeName,
  ReservedClassAttributes
};