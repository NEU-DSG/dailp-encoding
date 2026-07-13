import { Mp3Encoder } from "@breezystack/lamejs"

// Samples per frame for MP3 encoding. 1152 is the standard for MPEG-1 Layer III
const SAMPLES_PER_FRAME = 1152
// Should be fine for most use cases, but can be adjusted if needed
const BITRATE_KBPS = 128

export async function encodeBlobToMp3(blob: Blob): Promise<Blob> {
  // Get raw bytes from the Blob
  const buf = await blob.arrayBuffer()

  // Decode step and release audio context resources after decoding
  const audioCtx = new AudioContext()
  const audio = await audioCtx.decodeAudioData(buf)
  await audioCtx.close()

  // Metadata for MP3 encoding
  const channels = audio.numberOfChannels
  const sampleRate = audio.sampleRate

  const encoder = new Mp3Encoder(channels, sampleRate, BITRATE_KBPS)

  // Convert float audio data to 16-bit PCM as per LAME requirements
  const left = floatTo16BitPCM(audio.getChannelData(0))
  // If stereo, get the right channel; otherwise, set it to null
  const right = channels > 1 ? floatTo16BitPCM(audio.getChannelData(1)) : null

  // Encode audio data in chunks to MP3 format based on the defined samples per frame
  const mp3Chunks: Uint8Array[] = []
  for (let i = 0; i < left.length; i += SAMPLES_PER_FRAME) {
    const leftChunk = left.subarray(i, i + SAMPLES_PER_FRAME)
    // If stereo, encode both channels
    // If mono, the left channel is mirrored to the right channel for encoding
    const encoded = right
      ? encoder.encodeBuffer(
          leftChunk,
          right.subarray(i, i + SAMPLES_PER_FRAME)
        )
      : encoder.encodeBuffer(leftChunk)
    if (encoded.length > 0) {
      mp3Chunks.push(encoded)
    }
  }

  const flushed = encoder.flush()
  if (flushed.length > 0) {
    mp3Chunks.push(flushed)
  }

  // Concatenate all MP3 chunks into a single Blob tagged audio/mpeg and return it
  const blobParts: BlobPart[] = mp3Chunks.map((chunk) => new Uint8Array(chunk))
  return new Blob(blobParts, { type: "audio/mpeg" })
}

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    // Clamp the float value to the range [-1, 1]
    const s = Math.max(-1, Math.min(1, input[i]!))
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return output
}
