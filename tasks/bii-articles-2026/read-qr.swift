// Reads a QR code image back and prints what it says.
//
// make-qr.py proves what we asked for; this proves what a camera will see. It uses
// the QR detector built into macOS, so there is nothing to install.
//
// Usage: swift tasks/bii-articles-2026/read-qr.swift <image.png> <expected-url>
// Exit 0 when the image decodes to exactly the expected address, 1 otherwise.

import CoreImage
import Foundation

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  print("Usage: swift tasks/bii-articles-2026/read-qr.swift <image.png> <expected-url>")
  exit(1)
}

let expected = arguments[2]
guard let image = CIImage(contentsOf: URL(fileURLWithPath: arguments[1])) else {
  print("FAIL  could not open \(arguments[1])")
  exit(1)
}

let detector = CIDetector(
  ofType: CIDetectorTypeQRCode,
  context: nil,
  options: [CIDetectorAccuracy: CIDetectorAccuracyHigh]
)
let messages = (detector?.features(in: image) ?? []).compactMap { ($0 as? CIQRCodeFeature)?.messageString }

guard let found = messages.first else {
  print("FAIL  no QR code found in \(arguments[1])")
  exit(1)
}

if found == expected {
  print("PASS  \(arguments[1]) reads as \(found)")
  exit(0)
}

print("FAIL  \(arguments[1]) reads as \(found), expected \(expected)")
exit(1)
