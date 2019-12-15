'use strict';

/**
 * CIP Vol 1, Appendix C-1.4.1
 * 
 * The port segment shall indicate the communication port
 * through which to leave the node and the link address of
 * the next device in the routing path.
 */

const {
  getBit,
  getBits
} = require('../../../../../utils');

class PortSegment {
  static Decode(buffer, offset, cb) {
    if (getBits(buffer.readUInt8(offset), 5, 8) !== 0) {
      
    }
    const static
  }
}