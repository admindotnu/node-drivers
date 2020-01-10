'use strict';

const CIPRequest = require('./core/request');
const { CommonServiceCodes } = require('./core/constants');
const { CallbackPromise } = require('../../utils');
const EPath = require('./core/epath');
const Layer = require('../Layer');
const ConnectionLayer = require('./CIPInternalLayer');


class CIPLayer extends Layer {
  constructor(lowerLayer, options, name) {
    /** Inject Connection as lower layer */
    lowerLayer = new ConnectionLayer(lowerLayer, options);

    // const name = arguments.length === 3 ? arguments[2] : 'cip';
    super(name || 'cip', lowerLayer);
  }
  
  sendRequest(connected, request, callback) {
    return CallbackPromise(callback, resolver => {
      CIPLayer.Send(this, connected, request, function (error, reply) {
        if (error) {
          resolver.reject(error, reply);
        } else {
          resolver.resolve(reply);
        }
      });
    });
  }


  exploreAttributes(classCode, instanceID, maxAttribute, callback) {
    if (typeof maxAttribute === 'function') {
      callback = maxAttribute;
      maxAttribute = null;
    }

    if (maxAttribute == null) {
      maxAttribute = 20;
    }

    // return CallbackPromise(callback, async resolver => {
    //   const service = CommonServiceCodes.GetAttributesAll;
    //   const path = EPath.Encode(true [
    //     new EPath.Segments.Logical.ClassID(classCode),
    //     new EPath.Segments.Logical.InstanceID(instanceID)
    //   ]);
    //   const reply = await this.sendRequest(true, new CIPRequest(service, path));
    //   resolver.resolve(reply.data);
    // });

    return CallbackPromise(callback, async resolver => {
      const service = CommonServiceCodes.GetAttributeSingle;

      const attributes = [];

      for (let i = 1; i < maxAttribute; i++) {
        try {
          const path = EPath.Encode(true, [
            new EPath.Segments.Logical.ClassID(classCode),
            new EPath.Segments.Logical.InstanceID(instanceID),
            new EPath.Segments.Logical.AttributeID(i)
          ]);
          const reply = await this.sendRequest(true, new CIPRequest(service, path));
          attributes.push({
            code: i,
            data: reply.data
          });
        } catch (err) {
          if (!err.info || !err.info.status || err.info.status.code !== 20) {
            return resolver.reject(err);
          }
        }
      }

      resolver.resolve(attributes);
    });
  }


  handleData(data, info, context) {
    const callback = this.callbackForContext(context);
    if (callback != null) {
      callback(null, data, info);
      return true;
    }
    // console.log(arguments);
    // console.log(`CIP layer unhandled data`);
    return false;
  }


  static Send(layer, connected, request, callback, timeout) {
    let context;
    if (typeof callback === 'function') {
      context = layer.contextCallback((error, message) => {
        if (error) {
          callback(error, message);
        } else {
          const res = request.response(message, 0);
          callback(res.status.error ? res.status.description : null, res);
        }
      }, null, timeout);
    }

    layer.send(request.encode(), { connected }, false, context);
  }
}

CIPLayer.EPath = EPath;

module.exports = CIPLayer;