// Streams
// Readable streams are used to read data, Transform streams are used to modify the data,
// and Writable streams are used to write the final output.
// process.stdin -> Readable Stream
//   .pipe(process.stdout) -> Writable Stream

import { Readable, Writable, Transform } from 'node:stream'

// This code demonstrates the use of Node.js streams to create a pipeline that generates numbers from 1 to 100,
// transforms them by multiplying by -1, and then multiplies the result by 10 before
// outputting the final result to the console.
// Buffer.from() converts a string to a Buffer
// In Node.js, Buffers are used to handle binary data
// Here, we convert the number to a string and then to a Buffer
// This is useful when working with streams, as they often deal with binary data
// The Buffer will be pushed to the next stream in the pipeline
// The next stream will receive this Buffer and can process it further
// In this case, the next stream will receive a Buffer containing the string representation of the number
// For example, if i is 1, the Buffer will contain the string "1"
// If i is 2, the Buffer will contain the string "2", and so on
// This allows us to create a stream of numbers from 1 to 100
// The setTimeout is used to simulate a delay of 1 second between each number
// This is useful for demonstration purposes, to show how streams can handle data over time
// In a real-world scenario, you might read data from a file, a database,
// or an API, and process it in a similar way
// The delay can be adjusted or removed as needed
// The _read method is called by the stream when it needs more data
// The stream will continue to push data until it reaches the end (i.e., when i > 100)
// At that point, it will push null to signal the end of the stream
// This is how streams work in Node.js, allowing us to handle data efficiently
// and process it in a memory-efficient way.
// This is particularly useful for large datasets or when dealing with real-time data streams.
class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))

        this.push(buf)
      }
    }, 1000);
  }
}

// The InverseNumberStream is a Transform stream that takes the input data,
// converts it to a number, multiplies it by -1, and outputs the transformed data
// as a Buffer. It uses the _transform method to handle the incoming data chunks.
// The transformed data is then passed to the next stream in the pipeline.
// This allows for efficient data processing and transformation in Node.js applications.
// Transform streams are useful for modifying data as it flows through the stream,
// enabling operations like filtering, mapping, or aggregating data without needing to
// store the entire dataset in memory at once.
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    callback(null, Buffer.from(String(transformed)))
  }
}

// The MultiplyByTenStream is a Writable stream that takes the transformed data
// and multiplies it by 10 before outputting the result to the console.
// It uses the _write method to handle the incoming data chunks and perform the multiplication.
// The result is logged to the console, demonstrating how streams can be used to process data in
// a pipeline fashion, where each stream can modify the data as it passes through.
// This allows for efficient data processing and transformation in Node.js applications.
// The Writable stream is the final step in the pipeline, where the data is consumed and processed
// before being output or stored.
class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream())
