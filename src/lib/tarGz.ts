import zlib from 'zlib'

/**
 * Creates a standard USTAR tar header (512 bytes)
 */
function createTarHeader(filename: string, size: number): Buffer {
  const header = Buffer.alloc(512)
  
  // 1. File name (0..99)
  header.write(filename.slice(0, 100), 0, 100, 'utf-8')
  
  // 2. File mode (100..107) -> 0000644
  header.write('0000644 \0', 100, 8, 'utf-8')
  
  // 3. Owner UID (108..115) -> 0000000
  header.write('0000000 \0', 108, 8, 'utf-8')
  
  // 4. Owner GID (116..123) -> 0000000
  header.write('0000000 \0', 116, 8, 'utf-8')
  
  // 5. Size in octal (124..135)
  const sizeOctal = size.toString(8).padStart(11, '0') + ' '
  header.write(sizeOctal, 124, 12, 'utf-8')
  
  // 6. Last modification time (136..147)
  const mtimeOctal = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + ' '
  header.write(mtimeOctal, 136, 12, 'utf-8')
  
  // 7. Checksum placeholder (148..155) filled with spaces initially
  header.fill(' ', 148, 156)
  
  // 8. Type flag (156) -> '0' (Regular file)
  header.write('0', 156, 1, 'utf-8')
  
  // 9. UStar indicator "ustar\0" (257..262) & version "00" (263..264)
  header.write('ustar\0', 257, 6, 'utf-8')
  header.write('00', 263, 2, 'utf-8')
  
  // Calculate checksum: sum of all 512 bytes with spaces at checksum field
  let checksum = 0
  for (let i = 0; i < 512; i++) {
    checksum += header[i]
  }
  
  // Write checksum as 6-digit octal with null and space
  const checksumOctal = checksum.toString(8).padStart(6, '0') + '\0 '
  header.write(checksumOctal, 148, 8, 'utf-8')
  
  return header
}

/**
 * Packs multiple files into a valid .tar.gz archive
 * @param files Key-value map of { "filename.ext": "content string" }
 * @returns Gzipped Buffer (.tar.gz)
 */
export function createTarGz(files: Record<string, string>): Buffer {
  const chunks: Buffer[] = []

  for (const [filename, content] of Object.entries(files)) {
    const fileBuf = Buffer.from(content, 'utf-8')
    const header = createTarHeader(filename, fileBuf.length)
    
    chunks.push(header)
    chunks.push(fileBuf)
    
    // Tar blocks are 512 bytes; pad with zeros to next 512 boundary
    const remainder = fileBuf.length % 512
    if (remainder !== 0) {
      chunks.push(Buffer.alloc(512 - remainder))
    }
  }

  // End of archive marker: two 512-byte blocks of zeros (1024 bytes)
  chunks.push(Buffer.alloc(1024))

  const tarBuffer = Buffer.concat(chunks)
  return zlib.gzipSync(tarBuffer)
}
