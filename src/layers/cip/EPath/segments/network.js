'use strict';

/**
 * CIP Vol 1, Appendix C-1.4.3
 * 
 * The network segment shall be used to specify network parameters that may be required by a
 * node to transmit a message across a network. The network segment shall immediately precede
 * the port segment of the device to which it applies. In other words, the network segment shall
 * be the first item in the path that the device receives.
 */

const {
  // getBit,
  getBits,
  InvertKeyValues
} = require('../../../../utils');

const SubtypeCodes = Object.freeze({
  Schedule: 1,
  FixedTag: 2,
  ProductionInhibitTime: 3,
  Safety: 16,
  Extended: 31
});

const SubtypeNames = Object.freeze(InvertKeyValues(SubtypeCodes));


class NetworkSegment {
  constructor(subtype, value) {
    this.subtype = subtype;
    this.value = value;
  }


  encodeSize() {
    switch (this.subtype) {
      case SubtypeCodes.Schedule:
      case SubtypeCodes.FixedTag:
      case SubtypeCodes.ProductionInhibitTime:
        return 2;
      default:
        throw new Error(`Network segment subtype ${this.subtype} not supported yet`);
    }
  }

  encode() {
    const buffer = Buffer.alloc(this.encodeSize());
    this.encodeTo(buffer, 0);
    return buffer;
  }

  encodeTo(buffer, offset) {
    offset = buffer.writeUInt8((0b01000000) | (this.subtype & 0b11111), offset);
    switch (this.subtype) {
      case SubtypeCodes.Schedule:
      case SubtypeCodes.FixedTag:
      case SubtypeCodes.ProductionInhibitTime:
        offset = buffer.writeUInt8(this.value, offset);
        break;
      default:
        throw new Error(`Network segment subtype ${this.subtype} not supported yet`);
    }
    
    return offset;
  }

  static Decode(segmentCode, buffer, offset, padded, cb) {
    const subtype = getBits(segmentCode, 0, 5);

    let value;
    switch (subtype) {
      case SubtypeCodes.Schedule:
      case SubtypeCodes.FixedTag:
      case SubtypeCodes.ProductionInhibitTime:
        value = buffer.readUInt8(offset); offset += 1;
        break;
      case SubtypeCodes.Safety:
      case SubtypeCodes.Extended:
        /** variable */
        throw new Error(`Network segment subtype ${SubtypeNames[subtype]} not currently supported. TODO`);
        break;
      default:
        throw new Error(`Reserved Network segment subtype ${subtype}`);
    }

    if (typeof cb === 'function') {
      cb(new NetworkSegment(subtype, value));
    }

    return offset;
  }
}

module.exports = NetworkSegment;