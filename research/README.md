# Research sources and methods

Our three-person group studied how decoding temperature changes the structure of generated text. The [report](../docs/files/Research_Report.pdf) uses the source IDs below so readers can check each result. The website replays saved text and computes the logistic map and four-token decoder locally.

## Source crosswalk

| Experiment | Sources | Public material |
| --- | --- | --- |
| Earth prompt, two checkpoints × seven temperatures | S018 and S022 | [DistilGPT-2](notebooks/distilgpt2_sentence_sweep.ipynb), [GPT-2](notebooks/gpt2_sentence_sweep.ipynb), [all 336 sentence records](../data/sentence_traces.csv) |
| GPT-2 and Gemma 2 2B, twenty temperatures | S071 and S074 | [Two-checkpoint configuration](notebooks/paired_gpt2_gemma_sweep.ipynb), [40 saved strings](../data/paired_sweep.csv). Both notebook versions preserve the same 40 strings. |
| Stance labeling | S073 | [Greedy decoding and rule-based labels](notebooks/stance_labels.ipynb). A, B and D encode neutral, correct and incorrect statements for this specific question. |
| Logistic dynamics and stationary entropy | S024, S025 | [Symbolic map notebook](notebooks/symbolic_logistic_map.ipynb), [recorded transition counts](../data/map_transition_counts.csv), [independent calculation](../examples/reproduce.py). The original estimator and the corrected calculation are documented on page 9. |
| Period detection in Gemma and Qwen | S026 | [Sweep notebook](notebooks/gemma_qwen_period_sweep.ipynb), aggregate results on report page 10. The per-run CSVs named in the notebook were absent from the archive. |
| Four-token decoder | S023, S044 | [Original notebook](notebooks/four_token_decoder.ipynb), [browser simulation](../docs/math.js), [Python replay](../examples/reproduce.py). The replay holds start, weights and decoding rule fixed throughout each comparison. |
| Embedding similarities and attention | S019, S043, S068 | [Gemma embedding geometry](notebooks/gemma_embedding_geometry.ipynb), [GPT-2 embedding geometry](notebooks/gpt2_embedding_geometry.ipynb). Report pages 14–15 distinguish vocabulary embeddings and Q/K/V projections. |
| Hidden-state graphs | S056, S057, S066, S069, S092–S094, S102–S103 | [First corpus](notebooks/hidden_state_networks.ipynb), [second corpus](notebooks/hidden_state_networks_second_corpus.ipynb), [graph files](../data/). Report pages 16–17 describe thresholds and edge semantics. |
| Adaptive-temperature controller | S086 and S087 | [Enhanced execution](notebooks/temperature_controller_enhanced.ipynb), [baseline execution](notebooks/temperature_controller_baseline.ipynb). Report pages 19–20 keep the two executions separate. |
| Wider model comparisons, research poster and feature steering | Group reports, S005 and Neuronpedia materials | Report pages 5, 11 and 18 present the archived observations and figures. These studies include results for which the archive retained only presentation material. |

## Read the files correctly

- **Sentence atlas.** Each CSV row records a generated sentence, its 1-based position, checkpoint, temperature and cluster. The seven-temperature experiments used seed 1, top-k 50, a 256-new-token cap and character 3–5-gram TF-IDF with a greedy cosine threshold of 0.45. Letters reset within each run. The sentences preserve model errors.
- **Period sweeps.** The Gemma/Qwen study maps token IDs to three arithmetic bins. Qwen requires at least 50 symbols, while Gemma retains any nonempty generation. This encoding is independent of both semantic sentence clusters and truth labels.
- **Transition matrix.** Each row is a current symbol, each numeric column a next symbol. Row-normalize the counts to obtain P, solve πP = π and average the row entropies using π. The retained data permit an independent numerical check.
- **Graph exports.** The three GEXFs contain 14 nodes/55 edges, 20/190 and 15/105 respectively. The filenames and definitions appear in the report. A connected component measures connectivity at the experiment’s chosen edge rule and threshold.
- **Controller.** Adaptive and standard generation used different token filtering paths. Reported differences combine the feedback policy with filtering and other execution details. Independent evaluation requires matched controls.

## Running a notebook

Open a notebook in Jupyter or Colab and review its setup cells. The historical notebooks use their original package-install cells, model APIs and plotting conventions. Several download model weights, and the Gemma studies require checkpoint access through Hugging Face. Configure any required access in your own environment before running those notebooks. Source-only copies omit saved execution output, machine metadata and account login cells. Some notebook cells write generated graphs or CSVs into their working directory.

The [Python replay](../examples/reproduce.py) and website use bundled data. They give a reproducible route to the headline counts and simulations without downloading weights. Fresh generations can vary with software versions, hardware and randomness. The research bundle does not include model weights.

## Credits

Orbitglass was a three-person group research project at George Washington University. The report identifies the original sources of reference figures and published methods.
