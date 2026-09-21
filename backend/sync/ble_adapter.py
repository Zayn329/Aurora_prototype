import gzip
import json
import zlib
from typing import List, Dict, Any, Optional


class BLETransportAdapter:
    """
    Physical BLE GATT Transport Layer Adapter.
    Encapsulates 512-byte MTU packet chunking, headers, CRC checksums, and store-and-forward TTL handling.
    """

    CHUNK_SIZE = 512  # Standard BLE GATT MTU payload size
    HEADER_MAGIC = b"AUR1"  # 4-byte header magic identifier

    @classmethod
    def serialize_and_chunk(cls, sync_payload: Dict[str, Any], ttl: int = 3) -> List[bytes]:
        """
        Compresses sync payload JSON with Gzip and splits into 512-byte GATT packets with binary header.
        Header: [MAGIC 4B][TTL 1B][CHUNK_IDX 2B][TOTAL_CHUNKS 2B][CRC32 4B][PAYLOAD...]
        """
        raw_json = json.dumps(sync_payload).encode("utf-8")
        compressed = gzip.compress(raw_json)
        crc32 = zlib.crc32(compressed) & 0xFFFFFFFF

        data_size = cls.CHUNK_SIZE - 13  # 13 bytes header overhead
        total_chunks = (len(compressed) + data_size - 1) // data_size if len(compressed) > 0 else 1

        packets: List[bytes] = []

        for idx in range(total_chunks):
            start = idx * data_size
            end = start + data_size
            chunk_data = compressed[start:end]

            # Header construction
            header = cls.HEADER_MAGIC
            header += ttl.to_bytes(1, "big")
            header += idx.to_bytes(2, "big")
            header += total_chunks.to_bytes(2, "big")
            header += crc32.to_bytes(4, "big")

            packet = header + chunk_data
            packets.append(packet)

        return packets

    @classmethod
    def reassemble_packets(cls, packets: List[bytes]) -> Optional[Dict[str, Any]]:
        """Reassembles 512-byte GATT packet chunks, validates CRC32, and decompresses JSON payload."""
        if not packets:
            return None

        # Sort packets by chunk index
        parsed_chunks = []
        expected_crc = None
        total_chunks = 0

        for packet in packets:
            if len(packet) < 13 or packet[:4] != cls.HEADER_MAGIC:
                continue  # Invalid header

            ttl = packet[4]
            chunk_idx = int.from_bytes(packet[5:7], "big")
            tot_chunks = int.from_bytes(packet[7:9], "big")
            crc32 = int.from_bytes(packet[9:13], "big")
            chunk_data = packet[13:]

            expected_crc = crc32
            total_chunks = tot_chunks
            parsed_chunks.append((chunk_idx, chunk_data))

        parsed_chunks.sort(key=lambda x: x[0])

        if len(parsed_chunks) != total_chunks:
            return None  # Missing chunks

        compressed_data = b"".join([c[1] for c in parsed_chunks])

        # Validate CRC32
        actual_crc = zlib.crc32(compressed_data) & 0xFFFFFFFF
        if actual_crc != expected_crc:
            raise ValueError("BLE Transport CRC32 checksum mismatch")

        decompressed = gzip.decompress(compressed_data)
        return json.loads(decompressed.decode("utf-8"))
