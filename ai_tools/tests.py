from services.tides import summarize_tides

def test_summarize_tides():
    summary = summarize_tides("8726520")
    assert "high tide" in summary.lower() or "low tide" in summary.lower()

# def test_summarize_currents():
#     summary = summarize_tides("8726520")
#     assert "high tide" in summary.lower() or "low tide" in summary.lower()