import pytest
from backend.sync.ble_adapter import BLETransportAdapter


def test_ble_transport_packet_chunking_and_reassembly():
    sync_payload = {
        "device_id": "device_field_laptop_01",
        "operations": [
            {
                "op_id": "op_ble_test_999",
                "device_id": "device_field_laptop_01",
                "device_seq_num": 1,
                "timestamp_utc": "2026-09-21T03:00:00Z",
                "entity_type": "CARGO",
                "entity_id": "cargo-fuel-crate-001",
                "action": "UPDATE",
                "payload": {"delay_hours": 12.0, "status": "DELAYED"},
                "field_revisions": {},
            }
        ],
    }

    # 1. Chunk payload into 512-byte GATT packets
    packets = BLETransportAdapter.serialize_and_chunk(sync_payload, ttl=3)
    assert len(packets) >= 1
    assert len(packets[0]) <= 512
    assert packets[0][:4] == b"AUR1"  # Header magic

    # 2. Reassemble GATT packet chunks
    reassembled = BLETransportAdapter.reassemble_packets(packets)
    assert reassembled is not None
    assert reassembled["device_id"] == "device_field_laptop_01"
    assert len(reassembled["operations"]) == 1
    assert reassembled["operations"][0]["op_id"] == "op_ble_test_999"


def test_ble_transport_crc32_corruption_rejection():
    sync_payload = {"test": "data"}
    packets = BLETransportAdapter.serialize_and_chunk(sync_payload)

    # Corrupt packet binary payload
    corrupted_packet = bytearray(packets[0])
    corrupted_packet[-1] ^= 0xFF  # Flip bit in payload

    with pytest.raises(ValueError) as exc_info:
        BLETransportAdapter.reassemble_packets([bytes(corrupted_packet)])

    assert "CRC32 checksum mismatch" in str(exc_info.value)
