import unittest
from collections import Counter
from pathlib import Path
import json
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "examples"))
from reproduce import decode, load_traces, markov_entropy, read_rows, summarize


class ResearchTests(unittest.TestCase):
    def test_original_trace_counts(self):
        traces = load_traces()
        self.assertEqual(len(traces), 14)
        self.assertEqual(sum(map(len, traces.values())), 336)
        self.assertEqual(summarize(traces["GPT-2", "0.10"]), (33, 32, 1, 2))
        self.assertEqual(summarize(traces["DistilGPT-2", "0.10"]), (52, 1, 51, None))

    def test_export_matches_demo(self):
        docs = Path(__file__).resolve().parents[1] / "docs"
        def read_js_data(name):
            source = (docs / name).read_text(encoding="utf-8-sig")
            return json.loads(source.partition("=")[2].strip().rstrip(";"))
        traces, sentences = read_js_data("traces.js"), read_js_data("sentences.js")
        for row in read_rows("sentence_traces.csv"):
            model = {"GPT-2": "GPT2", "DistilGPT-2": "Distil"}[row["model"]]
            index, temp = int(row["sentence_index"]) - 1, row["temperature"]
            self.assertEqual(row["cluster"], traces[model][temp][index])
            self.assertEqual(row["sentence"], sentences[model][temp][index])

    def test_paired_grid(self):
        rows = read_rows("paired_sweep.csv")
        self.assertEqual(Counter(row["model"] for row in rows), {"GPT-2": 20, "Gemma-2-2B": 20})
        self.assertEqual(len({(row["model"], row["temperature"]) for row in rows}), 40)

    def test_stationary_entropy(self):
        counts = [[int(row[key]) for key in ("A", "B", "D")] for row in read_rows("map_transition_counts.csv")]
        weights, rate = markov_entropy(counts)
        for j, weight in enumerate(weights):
            self.assertAlmostEqual(weight, sum(w * row[j] / sum(row) for w, row in zip(weights, counts)))
        self.assertAlmostEqual(rate, 0.951, places=3)

    def test_decoder_intervention(self):
        self.assertEqual(decode(.8), "ACCA" + "AA" + "B" * 6 + "D" * 18)
        self.assertEqual(decode(.88), "ACCA" + "A" + "B" * 21 + "D" * 4)


if __name__ == "__main__":
    unittest.main()

