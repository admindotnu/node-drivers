'use strict';

const { getBit } = require('../../util');

/*
  Communication Profile Families

  CPF 1: Foundation Fieldbus (H1, H2, HSE)
  CPF 2: CIP (ControlNet, EtherNet/IP, DeviceNet)
  CPF 3: Profibus (DP, PA, Profinet)
  CPF 4: P-Net (P-NET RS-485, P-NET RS-232, P-NET on IP)
  CPF 5: WorldFIP
  CPF 6: Interbus
  CPF 7: Swiftnet (widthdrawn)
  CPF 8: CC-Link
  CPF 9: HART
  CPF 10: Vnet/IP
  CPF 11: TCnet
  CPF 12: EtherCat
  CPF 13: Ethernet Powerlink
  CPF 14: EPA
  CPF 15: Modbus-RTPS (Modbus-RTPS, Modbus TCP)
  CPF 16: SERCOS
*/

const Commands = {
  NOP: 0x0000,
  ListServices: 0x0004,
  ListIdentity: 0x0063,
  ListInterfaces: 0x0064,
  RegisterSession: 0x0065,
  UnregisterSession: 0x0066,
  SendRRData: 0x006F,
  SendUnitData: 0x0070,
  IndicateStatus: 0x0072, // needs to be added to EIPReply parsers
  Cancel: 0x0073 // needs to be added to EIPReply parsers
};

const CPFItemIDs = {
  NullAddress: 0x0000, // address
  ListIdentity: 0x000C, // response
  ConnectionBased: 0x00A1, // address
  ConnectedMessage: 0x00B1, // data
  UnconnectedMessage: 0x00B2, // data
  ListServices: 0x0100, // response
  SockaddrInfoOtoT: 0x8000, // data
  SockaddrInfoTtoO: 0x8001, // data
  SequencedAddress: 0x8002 // unknown?
};

const NullSenderContext = Buffer.alloc(8);

class EIPPacket {
  constructor() {
    this.Command = 0;
    this.Length = 0;
    this.SessionHandle = 0;
    this.SenderContext = NullSenderContext;
    this.Options = 0;
    this.Data = Buffer.alloc(0);
    this.status = {
      code: 0,
      description: ''
    };
  }

  setData(data) {
    if (Buffer.isBuffer(data)) {
      this.Data = data;
      this.Length = data.length;
    } else {
      console.log('NOT A BUFFER: ' + data);
    }
  }

  static fromBuffer(buffer) {
    const command = EIPPacket.Command(buffer);
    const packet = EIPPacket.BaseFromBuffer(buffer);
    const replyParse = EIPReply[command];

    if (packet.status.code === 0) {
      if (replyParse) {
        replyParse(packet);
      } else {
        console.log('');
        console.log('EIPPacket Error: Unrecognized command:');
        console.log(Buffer.from([command]));
      }
    }

    return packet;
  }

  static BaseFromBuffer(buffer) {
    const packet = new EIPPacket();
    packet.Command = EIPPacket.Command(buffer);
    packet.Length = EIPPacket.DataLength(buffer);
    packet.SessionHandle = buffer.readUInt32LE(4);
    packet.status.code = buffer.readUInt32LE(8);
    packet.SenderContext = Buffer.from(buffer.slice(12, 20));
    packet.Options = buffer.readUInt32LE(20);
    packet.Data = buffer.length > 24 ? Buffer.from(buffer.slice(24)) : Buffer.alloc(0);

    if (EIPStatusCodeDescriptions[packet.status.code]) {
      packet.status.description = EIPStatusCodeDescriptions[packet.status.code] || '';
    }

    return packet;
  }



  toBuffer(opts) {
    const buffer = Buffer.alloc(24 + this.Length);
    buffer.writeUInt16LE(this.Command, 0);
    buffer.writeUInt16LE(this.Length, 2);
    buffer.writeUInt32LE(this.SessionHandle, 4);
    buffer.writeUInt32LE(this.status.code, 8);
    this.SenderContext.copy(buffer, 12, 0, 8);
    buffer.writeUInt32LE(this.Options, 20);
    if (this.Length > 0 && this.Data && this.Data.length > 0) {
      const length = this.Data.length < this.Length ? this.Data.length : this.Length;
      this.Data.copy(buffer, 24, 0, length);
    }
    return buffer;
  }


  static IsComplete(buffer, length) {
    if (length < 24) return false;
    return (length >= EIPPacket.Length(buffer));
  }

  static NextMessage(buffer) {
    return buffer.slice(0, EIPPacket.Length(buffer));
  }

  static Length(buffer) {
    return 24 + EIPPacket.DataLength(buffer);
  }


  static DataLength(buffer) {
    return buffer.readUInt16LE(2);
  }

  static Command(buffer) {
    return buffer.readUInt16LE(0);
  }


  static UnregisterSessionRequest(sessionHandle, senderContext) {
    return toBuffer(Commands.UnregisterSession, sessionHandle, 0, senderContext, 0, []);
    // const packet = new EIPPacket();
    // packet.Command = Commands.RegisterSession;
    // packet.SessionHandle = sessionHandle;
    // packet.SenderContext = senderContext;
    // return packet.toBuffer();
  }

  static RegisterSessionRequest(senderContext) {
    return toBuffer(
      Commands.RegisterSession,
      0,
      0,
      senderContext,
      0,
      Buffer.from([0x01, 0x00, 0x00, 0x00]) // Protocol Version
    );
    // const packet = new EIPPacket();
    // packet.Command = Commands.RegisterSession;
    // packet.SenderContext = senderContext;
    // packet.setData(Buffer.from([0x01, 0x00, 0x00, 0x00])); // Protocol Version
    // return packet.toBuffer();
  }


  static ListIdentityRequest() {
    return toBuffer(Commands.ListIdentity, 0, 0, NullSenderContext, 0, []);
    // const packet = new EIPPacket();
    // packet.Command = Commands.ListIdentity;
    // return packet.toBuffer();
  }


  static ListServicesRequest(senderContext) {
    return toBuffer(Commands.ListServices, 0, 0, senderContext, 0, []);
    // const packet = new EIPPacket();
    // packet.Command = Commands.ListServices;
    // packet.SenderContext = senderContext;
    // return packet.toBuffer();
  }

  static ListInterfacesRequest() {
    return toBuffer(Commands.ListInterfaces, 0, 0, NullSenderContext, 0, []);
    // const packet = new EIPPacket();
    // packet.Command = Commands.ListInterfaces;
    // return packet.toBuffer();
  }

  static NOPRequest() {
    return toBuffer(Commands.NOP, 0, 0, NullSenderContext, 0, []);

    // const packet = new EIPPacket();
    // packet.Command = Commands.NOP;
    // return packet.toBuffer();
  }
}

EIPPacket.Commands = Commands;
EIPPacket.CPFItemIDs = CPFItemIDs;

module.exports = EIPPacket;


function toBuffer(command, handle, status, context, options, data = []) {
  const length = data.length;
  const buffer = Buffer.alloc(24 + length);
  buffer.writeUInt16LE(command, 0);
  buffer.writeUInt16LE(data.length, 2);
  buffer.writeUInt32LE(handle, 4);
  buffer.writeUInt32LE(status, 8);
  context.copy(buffer, 12, 0, 8);
  buffer.writeUInt32LE(options, 20);
  if (length > 0) {
    data.copy(buffer, 24, 0, length);
    // const dataLength = data.length < length ? data.length : length;
    // data.copy(buffer, 24, 0, dataLength);
  }
  return buffer;
}


const EIPReply = {};

EIPReply[Commands.ListServices] = function(packet) {
  let offset = 0;
  const data = packet.Data;
  const itemCount = data.readUInt16LE(offset); offset += 2;
  packet.Items = [];
  for (let i = 0; i < itemCount; i++) {
    const item = {};
    item.Type = data.readUInt16LE(offset); offset += 2;
    item.Length = data.readUInt16LE(offset); offset += 2;
    item.Version = data.readUInt16LE(offset); offset += 2;
    // item.Flags = data.readUInt16LE(offset); offset += 2;
    item.Flags = {};
    const flags = data.readUInt16LE(offset); offset += 2;
    item.Flags.Value = flags;
    item.Flags.SupportsCIPPacketEncapsulationViaTCP = !!getBit(flags, 5);
    item.Flags.SupportsCIPClass0or1UDPBasedConnections = !!getBit(flags, 8);

    let serviceName = '';
    for (let j = 0; j < 16; j++) {
      if (data[offset + j] > 0) {
        serviceName += String.fromCharCode(data[offset + j]);
      } else {
        break;
      }
    }
    offset += 16;
    item.ServiceName = serviceName;
    packet.Items.push(item);
  }
};

function ReadCPFPacket(packet, cb) {
  let offset = 0;
  const buffer = packet.Data;
  packet.Items = [];
  const itemCount = buffer.readUInt16LE(offset); offset += 2;

  for (let i = 0; i < itemCount; i++) {
    const item = {};
    item.Type = buffer.readUInt16LE(offset); offset += 2;
    let length = buffer.readUInt16LE(offset); offset += 2;
    // cb(item, length, buffer.slice(offset, offset + length));
    cb(item, length, offset, buffer);
    offset += length;
    packet.Items.push(item);
  }
}

EIPReply[Commands.ListIdentity] = function(packet) {
  ReadCPFPacket(packet, function(item, length, offset, buffer) {
    if (item.Type === CPFItemIDs.ListIdentity) {
       // Number of bytes in item which follow (length varies depending on Product Name string)

      const itemDataOffset = offset;
      item.EncapsulationProtocolVersion = buffer.readUInt16LE(offset); offset += 2;

      const socketAddress = {};
      socketAddress.sin_family = buffer.readInt16BE(offset); offset += 2;
      socketAddress.sin_port = buffer.readUInt16BE(offset); offset += 2;
      socketAddress.sin_addr = buffer.readUInt32BE(offset); offset += 4;
      socketAddress.sin_zero = buffer.slice(offset, offset + 8); offset += 8;
      item.SocketAddress = socketAddress;

      item.VendorID = buffer.readUInt16LE(offset); offset += 2;
      item.DeviceType = buffer.readUInt16LE(offset); offset += 2;
      item.ProductCode = buffer.readUInt16LE(offset); offset += 2;
      // item.Revision = buffer.slice(offset, offset + 2); offset += 2;
      item.Revision = {};
      item.Revision.Major = buffer.readUInt8(offset); offset += 1;
      item.Revision.Minor = buffer.readUInt8(offset); offset += 1;

      item.status = item.status || {};
      item.status.code = buffer.readUInt16LE(offset); offset += 2; // Data type is WORD
      item.SerialNumber = buffer.readUInt32LE(offset); offset += 4;

      const currentlyRead = offset - itemDataOffset;
      const productNameLength = length - currentlyRead - 1;
      
      const shifter = productNameLength % 2; // need to verify this!!!!!!!

      let productName = '';
      for (let j = 0; j < productNameLength - shifter; j++) {
        productName += String.fromCharCode(buffer[offset + j + shifter]);
      }
      item.ProductName = productName; offset += productNameLength;

      item.State = buffer.readUInt8(offset); offset += 1;

      if (IdentityInstanceStateDescriptions[item.State]) item.StateDescription = IdentityInstanceStateDescriptions[item.State];
    }
  });
};

EIPReply[Commands.RegisterSession] = function(packet) {
  let offset = 0;
  const data = packet.Data;
  packet.Protocol = data.readUInt16LE(offset); offset += 2;
  packet.Flags = data.readUInt16LE(offset); offset += 2;
  return packet;
};


EIPReply[Commands.ListInterfaces] = function(packet) {
  ReadCPFPacket(packet, function(item, length, offset, buffer) {
    item.Data = buffer.slice(offset, offset + length);
    // this needs more work
    if (length >= 4) {
      item.InterfaceHandle = buffer.readUInt32LE(offset); offset += 4;
    }
  });
};


// EIP-CIP-V1 2-7.3.1, page 2-21
// When used to encapsulate CIP, the format of the "data" field is
// that of a Message Router request or Message Router reply.
EIPReply[Commands.SendRRData] = function(packet) {
  const data = packet.Data;
  packet.InterfaceHandle = data.readUInt32LE(0); // shall be 0 for CIP
  packet.Timeout = data.readUInt16LE(4); // not used for reply
  packet.Data = packet.Data.slice(6);

  ReadCPFPacket(packet, function(item, length, offset, buffer) {
    if (item.Type === CPFItemIDs.UnconnectedMessage) {
      item.data = buffer.slice(offset, offset + length);
    }
  });
};

EIPReply[Commands.SendUnitData] = function(packet) {
  const data = packet.Data;
  packet.InterfaceHandle = data.readUInt32LE(0); // shall be 0 for CIP
  packet.Timeout = data.readUInt16LE(4); // not used for reply
  packet.Data = packet.Data.slice(6);

  ReadCPFPacket(packet, function(item, length, offset, buffer) {
    if (item.Type === CPFItemIDs.ConnectionBased) {
      item.address = buffer.readUInt32LE(offset);
    } else if (item.Type === CPFItemIDs.ConnectedMessage) {
      item.data = buffer.slice(offset, offset + length);
    }
  });
};

// const CPFItemIDDescriptions = {
//   0x0000: 'Null (used for UCMM messages).  Indicates that encapsulation routing is NOT needed.  Target is either local (ethernet) or routing info is in a data Item.',
//   0x000C: 'ListIdentity response',
//   0x00A1: 'Connection-based (used for connected messages)',
//   0x00B1: 'Connected Transport packet',
//   0x00B2: 'Unconnected message',
//   0x0100: 'ListServices response',
//   0x8000: 'Sockaddr Info, originator-to-target',
//   0x8001: 'Sockaddr Info, target-to-originator',
//   0x8002: 'Sequenced Address item'
// };

const EIPStatusCodeDescriptions = {
  0x0000: 'Success',
  0x0001: 'The sender issued an invalid or unsupported encapsulation command.',
  0x0002: 'Insufficient memory resources in the receiver to handle the command.  This is not an application error.  Instead, it only results if the encapsulation layer cannot obtain memory resources that it needs.',
  0x0003: 'Poorly formed or incorrect data in the data in the data portion of the encapsulation message.',
  0x0064: 'An originator used an invalid session handle when sending an encapsulation message to the target.',
  0x0065: 'The target received a message of invalid length.',
  0x0069: 'Unsupported encapsulation protocol revision.'
};

// EIP-CIP V1, 5-2.2, page 5-7
const IdentityInstanceStateDescriptions = {
  0: 'Nonexistent',
  1: 'Device Self Testing',
  2: 'Standby',
  3: 'Operational',
  4: 'Major Recoverable Fault',
  5: 'Major Unrecoverable Fault',
  255: 'Default for Get Attribute All service'
};
