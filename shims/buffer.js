// Buffer shim for web - provides Buffer API using Uint8Array
// This is a minimal implementation for web compatibility

class Buffer extends Uint8Array {
  constructor(input, encodingOrOffset, length) {
    if (typeof input === 'number') {
      super(input);
      return;
    }
    
    if (typeof input === 'string') {
      const encoding = encodingOrOffset || 'utf8';
      if (encoding === 'utf8' || encoding === 'utf-8') {
        const bytes = new TextEncoder().encode(input);
        super(bytes.length);
        this.set(bytes);
        return;
      }
      // For other encodings, use a simple implementation
      const bytes = new TextEncoder().encode(input);
      super(bytes.length);
      this.set(bytes);
      return;
    }
    
    if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
      super(input);
      return;
    }
    
    if (Array.isArray(input)) {
      super(input.length);
      this.set(input);
      return;
    }
    
    super(0);
  }
  
  toString(encoding = 'utf8') {
    if (encoding === 'utf8' || encoding === 'utf-8') {
      return new TextDecoder().decode(this);
    }
    if (encoding === 'hex') {
      return Array.from(this).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return new TextDecoder().decode(this);
  }
  
  static from(input, encodingOrOffset, length) {
    return new Buffer(input, encodingOrOffset, length);
  }
  
  static alloc(size, fill = 0, encoding = 'utf8') {
    const buf = new Buffer(size);
    if (typeof fill === 'string') {
      const fillBytes = new TextEncoder().encode(fill);
      for (let i = 0; i < size; i++) {
        buf[i] = fillBytes[i % fillBytes.length] || 0;
      }
    } else {
      buf.fill(fill);
    }
    return buf;
  }
  
  static concat(list, totalLength) {
    if (!Array.isArray(list) || list.length === 0) {
      return new Buffer(0);
    }
    
    if (totalLength === undefined) {
      totalLength = list.reduce((sum, buf) => sum + buf.length, 0);
    }
    
    const result = new Buffer(totalLength);
    let offset = 0;
    for (const buf of list) {
      result.set(buf, offset);
      offset += buf.length;
    }
    return result;
  }
  
  fill(value, offset = 0, end = this.length, encoding = 'utf8') {
    if (typeof value === 'string') {
      const bytes = new TextEncoder().encode(value);
      for (let i = offset; i < end; i++) {
        this[i] = bytes[i % bytes.length] || 0;
      }
    } else {
      for (let i = offset; i < end; i++) {
        this[i] = value;
      }
    }
    return this;
  }
}

// Add File class for undici compatibility
class File {
  constructor(bits, name, options = {}) {
    this.name = name;
    this.lastModified = options.lastModified || Date.now();
    this.size = bits.length || (bits.byteLength || 0);
    this.type = options.type || '';
    this._bits = bits;
  }
  
  stream() {
    return new ReadableStream({
      start: (controller) => {
        controller.enqueue(new Uint8Array(this._bits));
        controller.close();
      }
    });
  }
  
  arrayBuffer() {
    return Promise.resolve(this._bits instanceof ArrayBuffer ? this._bits : this._bits.buffer);
  }
  
  text() {
    return Promise.resolve(new TextDecoder().decode(this._bits));
  }
  
  slice(start, end, contentType) {
    const sliced = this._bits.slice(start, end);
    return new File([sliced], this.name, { type: contentType || this.type });
  }
}

module.exports = Buffer;
module.exports.Buffer = Buffer;
module.exports.File = File;

