"""Replay the archived counts and four-token intervention with Python 3.10+."""
import csv
from collections import defaultdict
from itertools import groupby
from math import exp, log2
from pathlib import Path
import xml.etree.ElementTree as ET

DATA = Path(__file__).resolve().parents[1] / "data"


def read_rows(name):
    with (DATA / name).open(encoding="utf-8", newline="") as source:
        return list(csv.DictReader(source))


def summarize(symbols):
    """Count sentence boundaries, longest run, and shortest exact period."""
    switches = sum(a != b for a, b in zip(symbols, symbols[1:]))
    longest = max((sum(1 for _ in group) for _, group in groupby(symbols)), default=0)
    period = next((p for p in range(1, min(16, len(symbols) // 2) + 1)
                   if symbols[p:] == symbols[:-p]), None)
    return len(symbols), switches, longest, period


def load_traces():
    traces = defaultdict(list)
    for row in read_rows("sentence_traces.csv"):
        key = row["model"], row["temperature"]
        assert int(row["sentence_index"]) == len(traces[key]) + 1
        traces[key].append(row["cluster"])
    return {key: "".join(symbols) for key, symbols in traces.items()}


def markov_entropy(rows):
    """Estimate the entropy rate of this fitted, irreducible, aperiodic chain."""
    totals = [sum(row) for row in rows]
    probabilities = [[count / total for count in row] for row, total in zip(rows, totals)]
    weights = [1 / len(rows)] * len(rows)
    for _ in range(10000):
        updated = [sum(w * row[j] for w, row in zip(weights, probabilities))
                   for j in range(len(rows))]
        delta = max(abs(a-b) for a, b in zip(weights, updated))
        weights = updated
        if delta < 1e-13:
            break
    else:
        raise ArithmeticError("The stationary distribution did not converge.")
    entropy = -sum(w * p * log2(p) for w, row in zip(weights, probabilities)
                   for p in row if p)
    return weights, entropy


def decode(b_x):
    """Single-head dot-product attention with tied embeddings and greedy decoding."""
    embeddings = {"A": (0.4, -0.3), "B": (b_x, 0), "C": (-0.2, -0.2), "D": (0.9, 0.5)}
    sequence = list("ACCA")

    def dot(left, right):
        return sum(a * b for a, b in zip(left, right))

    while len(sequence) < 30:
        history = [embeddings[s] for s in sequence]
        scores = [dot(history[-1], vector) for vector in history]
        weights = [exp(score - max(scores)) for score in scores]
        context = [sum(w * v[axis] for w, v in zip(weights, history)) / sum(weights)
                   for axis in range(2)]
        sequence.append(max(embeddings, key=lambda token: dot(context, embeddings[token])))
    return "".join(sequence)


def main():
    print("Recorded sentence traces")
    print("Model         Temp  Sentences  Switches  Longest  Period<=16")
    for (model, temp), symbols in load_traces().items():
        n, switches, longest, period = summarize(symbols)
        print(f"{model:<12} {temp:>4} {n:>10} {switches:>9} {longest:>8} {period or '-':>11}")
    rows = read_rows("map_transition_counts.csv")
    counts = [[int(row[symbol]) for symbol in ("A", "B", "D")] for row in rows]
    weights, entropy = markov_entropy(counts)
    print(f"\nMarkov weights {tuple(round(w, 4) for w in weights)}; entropy rate {entropy:.3f} bits/step")
    for x in (0.80, 0.88):
        sequence = decode(x)
        longest_b = max((len(list(run)) for symbol, run in groupby(sequence[4:]) if symbol == "B"), default=0)
        print(f"B.x {x:.2f}  {sequence}  longest B run {longest_b}")
    print(f"\nPaired sweep: {len(read_rows('paired_sweep.csv'))} recorded streams")
    for path in sorted(DATA.glob("*.gexf")):
        tree = ET.parse(path)
        print(f"{path.name}: {len(tree.findall('.//{*}node'))} nodes, {len(tree.findall('.//{*}edge'))} edges")


if __name__ == "__main__":
    main()

