import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Generates original, dependency-free PCM test loops for the demo player.
const sampleRate = 22050;
const seconds = 9;
const frameCount = sampleRate * seconds;
const outputDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../web/assets/music");

const tracks = [
  { filename: "蓝色时刻.wav", notes: [220, 261.63, 329.63, 392], pulse: 2.25, warmth: .34 },
  { filename: "纸上晨光.wav", notes: [261.63, 329.63, 392, 523.25], pulse: 1.5, warmth: .23 },
  { filename: "静默岛屿.wav", notes: [196, 246.94, 293.66, 369.99], pulse: 3, warmth: .42 }
];

function writeWav({ filename, notes, pulse, warmth }) {
  const pcmBytes = frameCount * 2;
  const buffer = Buffer.alloc(44 + pcmBytes);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + pcmBytes, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(pcmBytes, 40);

  for (let frame = 0; frame < frameCount; frame += 1) {
    const time = frame / sampleRate;
    const beat = Math.floor(time / pulse);
    const note = notes[beat % notes.length];
    const phase = (time % pulse) / pulse;
    const envelope = Math.min(1, phase * 14) * Math.pow(1 - phase, 1.7);
    const fade = Math.min(1, time * 2, (seconds - time) * 2);
    const shimmer = Math.sin(2 * Math.PI * note * time)
      + warmth * Math.sin(2 * Math.PI * note * 2 * time)
      + .12 * Math.sin(2 * Math.PI * note * .5 * time);
    const sample = Math.max(-1, Math.min(1, shimmer * envelope * fade * .3));
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + frame * 2);
  }

  writeFileSync(resolve(outputDirectory, filename), buffer);
}

mkdirSync(outputDirectory, { recursive: true });
tracks.forEach(writeWav);
console.log(`Generated ${tracks.length} original sample tracks in ${outputDirectory}`);
